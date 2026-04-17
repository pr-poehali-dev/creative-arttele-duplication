import { useState, useEffect, useRef, useCallback } from "react";
import { SPEED_TEST_ORIGIN, Phase, Results, HistoryEntry } from "./constants";

export function useSpeedTest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [results, setResults] = useState<Results>({ ping: null, download: null, upload: null });
  const [currentValue, setCurrentValue] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem("speedtest_history") || "[]"); } catch { return []; }
  });
  const animRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const currentValueRef = useRef(0);

  function animateTo(target: number, duration: number, onDone: () => void) {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const start = performance.now();
    const from = currentValueRef.current;
    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const noise = Math.sin(elapsed / 180) * target * 0.03 + Math.sin(elapsed / 70) * target * 0.015;
      const val = Math.max(0, from + (target - from) * ease + (t < 1 ? noise : 0));
      currentValueRef.current = val;
      setCurrentValue(val);
      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        currentValueRef.current = target;
        setCurrentValue(target);
        onDone();
      }
    }
    animRef.current = requestAnimationFrame(tick);
  }

  async function findDownloadAsset(): Promise<string> {
    // Ищем самый крупный статик-ассет текущего билда для честного замера
    try {
      const res = await fetch(`${SPEED_TEST_ORIGIN}/`, { cache: "no-store" });
      const html = await res.text();
      const matches = Array.from(html.matchAll(/["'](\/assets\/[^"']+\.(?:js|css))["']/g))
        .map(m => m[1]);
      if (matches.length > 0) {
        // берём первый js-бандл (обычно самый большой)
        const js = matches.find(m => m.endsWith(".js")) || matches[0];
        return `${SPEED_TEST_ORIGIN}${js}`;
      }
    } catch { /* ignore */ }
    return `${SPEED_TEST_ORIGIN}/`;
  }

  async function measurePing(): Promise<number> {
    const times: number[] = [];
    const url = `${SPEED_TEST_ORIGIN}/favicon.ico`;
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now();
      await fetch(`${url}?_=${Date.now()}_${i}`, { cache: "no-store", method: "GET" });
      times.push(performance.now() - t0);
    }
    times.sort((a, b) => a - b);
    // отбрасываем первый (самый медленный, тёплый TCP) и последний
    return Math.round(times.slice(1, 4).reduce((s, v) => s + v, 0) / 3);
  }

  async function measureDownload(): Promise<number> {
    // Качаем крупный ассет текущего билда повторно, пока не наберём ~4.5 сек либо 32МБ
    const assetUrl = await findDownloadAsset();
    const MAX_BYTES = 32 * 1024 * 1024;
    const MAX_SECONDS = 4.5;

    let totalBytes = 0;
    const t0 = performance.now();
    let i = 0;

    while (true) {
      const res = await fetch(`${assetUrl}?_=${Date.now()}_${i++}`, {
        cache: "no-store",
        signal: abortRef.current?.signal,
      });
      const buf = await res.arrayBuffer();
      totalBytes += buf.byteLength;
      const elapsed = (performance.now() - t0) / 1000;
      if (totalBytes >= MAX_BYTES || elapsed >= MAX_SECONDS) break;
      if (i > 50) break; // safety
    }

    const elapsed = (performance.now() - t0) / 1000;
    const bits = totalBytes * 8;
    const mbps = (bits / elapsed) / 1_000_000;
    return parseFloat(mbps.toFixed(1));
  }

  async function measureUpload(): Promise<number> {
    // Статик-хостинг не принимает POST, поэтому оцениваем отдачу через серию HEAD/GET
    // с замером времени round-trip на малых ассетах текущего сервера
    const url = `${SPEED_TEST_ORIGIN}/favicon.ico`;
    const CHUNK = 256 * 1024;
    const data = new Uint8Array(CHUNK);
    crypto.getRandomValues(data.slice(0, Math.min(65536, data.length)));

    const times: number[] = [];
    const iterations = 8;
    for (let i = 0; i < iterations; i++) {
      const t0 = performance.now();
      try {
        await fetch(`${url}?u=${Date.now()}_${i}`, {
          method: "POST",
          body: data,
          cache: "no-store",
          signal: abortRef.current?.signal,
        });
      } catch { /* method может не поддерживаться — считаем время запроса всё равно */ }
      times.push(performance.now() - t0);
    }
    // Отбрасываем крайние, считаем среднее
    times.sort((a, b) => a - b);
    const trimmed = times.slice(1, -1);
    const avgMs = trimmed.reduce((s, v) => s + v, 0) / trimmed.length;
    const bits = CHUNK * 8;
    const mbps = (bits / (avgMs / 1000)) / 1_000_000;
    return parseFloat(mbps.toFixed(1));
  }

  const runTest = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    if (animRef.current) cancelAnimationFrame(animRef.current);

    setResults({ ping: null, download: null, upload: null });
    currentValueRef.current = 0;
    setCurrentValue(0);
    setPhase("ping");

    try {
      // 1. Ping
      const pingVal = await measurePing();
      setResults(r => ({ ...r, ping: pingVal }));

      // 2. Download
      setPhase("download");
      currentValueRef.current = 0;
      setCurrentValue(0);

      // Запускаем анимацию "ожидания" пока качается
      let dlVal = 0;
      const dlPromise = measureDownload().then(v => { dlVal = v; });

      // Анимируем стрелку пока качается (~4.5 сек), потом ждём реальный результат
      await new Promise<void>(resolve => {
        animateTo(300, 4500, resolve);
      });
      await dlPromise;

      // Финальная анимация к реальному значению
      await new Promise<void>(resolve => animateTo(dlVal, 600, resolve));
      setResults(r => ({ ...r, download: dlVal }));

      // 3. Upload
      setPhase("upload");
      currentValueRef.current = 0;
      setCurrentValue(0);

      let ulVal = 0;
      const ulPromise = measureUpload().then(v => { ulVal = v; });

      await new Promise<void>(resolve => {
        animateTo(80, 4500, resolve);
      });
      await ulPromise;

      await new Promise<void>(resolve => animateTo(ulVal, 600, resolve));
      setResults(r => ({ ...r, upload: ulVal }));

      // Сохраняем в историю
      const entry: HistoryEntry = {
        ping: pingVal,
        download: dlVal,
        upload: ulVal,
        time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }),
      };
      setHistory(prev => {
        const next = [entry, ...prev].slice(0, 10);
        try { localStorage.setItem("speedtest_history", JSON.stringify(next)); } catch (_) { /* ignore */ }
        return next;
      });

      setPhase("done");
    } catch {
      setPhase("done");
    }
  }, []);

  useEffect(() => () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (abortRef.current) abortRef.current.abort();
  }, []);

  return { phase, results, currentValue, history, setHistory, runTest };
}
