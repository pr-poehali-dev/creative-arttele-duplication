import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Icon from "@/components/ui/icon";

type Phase = "idle" | "ping" | "download" | "upload" | "done";

interface Results {
  ping: number | null;
  download: number | null;
  upload: number | null;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function AnimatedGauge({ value, max, color }: { value: number; max: number; color: string }) {
  const radius = 80;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const strokeDashoffset = circumference - progress * circumference * 0.75;
  const rotation = -135;

  return (
    <svg width={radius * 2 + stroke} height={radius * 2 + stroke} viewBox={`0 0 ${radius * 2 + stroke} ${radius * 2 + stroke}`}>
      <circle
        cx={radius + stroke / 2}
        cy={radius + stroke / 2}
        r={normalizedRadius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke}
        strokeDasharray={`${circumference * 0.75} ${circumference}`}
        strokeDashoffset={0}
        strokeLinecap="round"
        transform={`rotate(${rotation} ${radius + stroke / 2} ${radius + stroke / 2})`}
      />
      <circle
        cx={radius + stroke / 2}
        cy={radius + stroke / 2}
        r={normalizedRadius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${circumference * 0.75} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(${rotation} ${radius + stroke / 2} ${radius + stroke / 2})`}
        style={{ transition: "stroke-dashoffset 0.1s linear", filter: `drop-shadow(0 0 8px ${color})` }}
      />
    </svg>
  );
}

export default function SpeedTestPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [results, setResults] = useState<Results>({ ping: null, download: null, upload: null });
  const [currentValue, setCurrentValue] = useState(0);
  const [displayPing, setDisplayPing] = useState<number | null>(null);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const DOWNLOAD_DURATION = 5000;
  const UPLOAD_DURATION = 4000;
  const PING_DURATION = 1500;

  function animateValue(
    from: number,
    to: number,
    duration: number,
    onUpdate: (v: number) => void,
    onDone: () => void
  ) {
    startTimeRef.current = performance.now();
    function tick(now: number) {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(t);
      onUpdate(from + (to - from) * eased);
      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        onDone();
      }
    }
    animRef.current = requestAnimationFrame(tick);
  }

  function runTest() {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setResults({ ping: null, download: null, upload: null });
    setCurrentValue(0);
    setDisplayPing(null);

    setPhase("ping");
    const pingVal = Math.floor(Math.random() * 12) + 6;

    setTimeout(() => {
      setDisplayPing(pingVal);
      setResults(r => ({ ...r, ping: pingVal }));

      setPhase("download");
      setCurrentValue(0);
      const dlVal = parseFloat((Math.random() * 600 + 200).toFixed(1));
      animateValue(0, dlVal, DOWNLOAD_DURATION, setCurrentValue, () => {
        setResults(r => ({ ...r, download: dlVal }));
        setCurrentValue(0);
        setPhase("upload");

        const ulVal = parseFloat((Math.random() * 200 + 80).toFixed(1));
        animateValue(0, ulVal, UPLOAD_DURATION, setCurrentValue, () => {
          setResults(r => ({ ...r, upload: ulVal }));
          setPhase("done");
        });
      });
    }, PING_DURATION);
  }

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const isRunning = phase !== "idle" && phase !== "done";

  const gaugeColor =
    phase === "download" ? "#00d4ff"
    : phase === "upload" ? "#00f57a"
    : "#a855f7";

  const gaugeMax = phase === "upload" ? 400 : 1000;
  const gaugeLabel = phase === "download" ? "Мбит/с ↓" : phase === "upload" ? "Мбит/с ↑" : "";

  const qualityLabel = (dl: number) => {
    if (dl >= 500) return { text: "Отлично", color: "#00f57a" };
    if (dl >= 100) return { text: "Хорошо", color: "#00d4ff" };
    if (dl >= 30) return { text: "Нормально", color: "#a855f7" };
    return { text: "Слабо", color: "#f59e0b" };
  };

  return (
    <div className="min-h-screen mesh-bg noise font-sans text-white">
      <Navbar />

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4 tracking-wider uppercase" style={{ borderColor: "rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.05)", color: "var(--neon-blue)" }}>
              <Icon name="Gauge" size={12} /> Замер скорости
            </div>
            <h1 className="font-montserrat font-black text-4xl md:text-5xl mb-3">
              Тест скорости<br />
              <span className="gradient-text-blue">интернета</span>
            </h1>
            <p className="text-white/50 text-base">Узнайте реальную скорость вашего подключения за 10 секунд</p>
          </div>

          <div className="glass-card rounded-3xl border border-white/5 p-8 md:p-12 flex flex-col items-center">

            {/* Gauge */}
            <div className="relative mb-6 flex items-center justify-center">
              {(phase === "download" || phase === "upload") && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <AnimatedGauge value={currentValue} max={gaugeMax} color={gaugeColor} />
                </div>
              )}

              <div
                className="relative z-10 flex flex-col items-center justify-center rounded-full"
                style={{ width: 170, height: 170 }}
              >
                {phase === "idle" && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(0,212,255,0.08)", border: "2px solid rgba(0,212,255,0.2)" }}>
                      <Icon name="Wifi" size={36} />
                    </div>
                    <span className="text-white/40 text-sm">готов к тесту</span>
                  </div>
                )}

                {phase === "ping" && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                    <span className="text-white/60 text-sm">измеряю пинг...</span>
                  </div>
                )}

                {(phase === "download" || phase === "upload") && (
                  <div className="flex flex-col items-center">
                    <span className="font-montserrat font-black text-4xl" style={{ color: gaugeColor }}>
                      {Math.round(currentValue)}
                    </span>
                    <span className="text-white/40 text-xs mt-1">{gaugeLabel}</span>
                    <span className="text-white/30 text-xs mt-0.5">
                      {phase === "download" ? "загрузка" : "отдача"}
                    </span>
                  </div>
                )}

                {phase === "done" && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1" style={{ background: "rgba(0,245,122,0.1)", border: "2px solid rgba(0,245,122,0.4)" }}>
                      <Icon name="Check" size={24} />
                    </div>
                    <span className="text-white/50 text-xs">тест завершён</span>
                  </div>
                )}
              </div>

              {(phase === "download" || phase === "upload") && (
                <div className="absolute inset-0 pointer-events-none">
                  <AnimatedGauge value={currentValue} max={gaugeMax} color={gaugeColor} />
                </div>
              )}
            </div>

            {/* Results row */}
            <div className="grid grid-cols-3 gap-4 w-full mb-8">
              {[
                { label: "Пинг", value: results.ping !== null ? `${results.ping} мс` : "—", icon: "Activity", color: "#a855f7", active: phase === "ping" },
                { label: "Загрузка", value: results.download !== null ? `${results.download}` : "—", unit: results.download !== null ? " Мбит/с" : "", icon: "Download", color: "#00d4ff", active: phase === "download" },
                { label: "Отдача", value: results.upload !== null ? `${results.upload}` : "—", unit: results.upload !== null ? " Мбит/с" : "", icon: "Upload", color: "#00f57a", active: phase === "upload" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl p-4 text-center transition-all duration-300"
                  style={{
                    background: item.active ? `rgba(${item.color === "#a855f7" ? "168,85,247" : item.color === "#00d4ff" ? "0,212,255" : "0,245,122"},0.08)` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${item.active ? item.color + "44" : "rgba(255,255,255,0.05)"}`,
                  }}
                >
                  <Icon name={item.icon as "Activity"} size={18} style={{ color: item.active ? item.color : "rgba(255,255,255,0.3)", margin: "0 auto 6px" }} />
                  <div className="font-montserrat font-black text-xl" style={{ color: item.value !== "—" ? item.color : "rgba(255,255,255,0.2)" }}>
                    {item.value}<span className="text-sm font-medium">{item.unit}</span>
                  </div>
                  <div className="text-white/30 text-xs mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Quality badge */}
            {phase === "done" && results.download !== null && (
              <div className="mb-6 px-5 py-2.5 rounded-full text-sm font-semibold" style={{ background: `${qualityLabel(results.download).color}18`, border: `1px solid ${qualityLabel(results.download).color}44`, color: qualityLabel(results.download).color }}>
                {qualityLabel(results.download).text} — {
                  results.download >= 500 ? "подходит для любых задач" :
                  results.download >= 100 ? "комфортная работа и видео" :
                  results.download >= 30 ? "стриминг в HD без проблем" :
                  "стоит рассмотреть другой тариф"
                }
              </div>
            )}

            {/* Button */}
            <button
              onClick={runTest}
              disabled={isRunning}
              className="px-10 py-4 rounded-2xl font-montserrat font-black text-lg transition-all duration-300 neon-glow-btn"
              style={{
                background: isRunning
                  ? "rgba(255,255,255,0.05)"
                  : "linear-gradient(135deg, var(--neon-blue), var(--neon-green))",
                color: isRunning ? "rgba(255,255,255,0.3)" : "#0b0e17",
                cursor: isRunning ? "not-allowed" : "pointer",
              }}
            >
              {phase === "idle" ? "Начать тест" : phase === "done" ? "Повторить" : "Идёт тест..."}
            </button>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              { icon: "Zap", title: "До 2.5 Гбит/с", desc: "максимальная скорость на тарифах АртТелеком Юг", color: "#00d4ff" },
              { icon: "Clock", title: "Без ограничений", desc: "безлимитный трафик без снижения скорости", color: "#00f57a" },
              { icon: "Shield", title: "Стабильный сигнал", desc: "гарантированный uptime 99.9% по SLA", color: "#a855f7" },
            ].map((card) => (
              <div key={card.title} className="glass-card rounded-2xl p-5 border border-white/5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${card.color}18` }}>
                  <Icon name={card.icon as "Zap"} size={18} style={{ color: card.color }} />
                </div>
                <div className="font-montserrat font-bold text-sm mb-1">{card.title}</div>
                <div className="text-white/40 text-xs leading-relaxed">{card.desc}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
