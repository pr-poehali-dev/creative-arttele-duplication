import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

type Phase = "idle" | "ping" | "download" | "upload" | "done";
interface Results { ping: number | null; download: number | null; upload: number | null; }

// Speedometer — semicircle arc like speedtest.net
const CX = 160, CY = 160, R = 130;
const START_ANGLE = 210; // degrees, from bottom-left
const END_ANGLE = 330;   // total sweep = 300deg (like speedtest.net)
const SWEEP = 300;

function degToRad(d: number) { return (d * Math.PI) / 180; }

function polarToXY(angleDeg: number, r: number) {
  const a = degToRad(angleDeg - 90); // -90 so 0deg is top
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

function arcPath(startDeg: number, endDeg: number, r: number) {
  const s = polarToXY(startDeg, r);
  const e = polarToXY(endDeg, r);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

const SCALE_MAX = 1000; // Mbit/s max
const UPLOAD_MAX = 400;

const TICK_LABELS = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

function Speedometer({ value, max, color, phase }: { value: number; max: number; color: string; phase: Phase }) {
  const progress = Math.min(value / max, 1);
  const fillEnd = START_ANGLE + progress * SWEEP;

  // Needle
  const needleAngle = START_ANGLE + progress * SWEEP;
  const needleTip = polarToXY(needleAngle, R - 18);
  const needleBase1 = polarToXY(needleAngle - 90, 10);
  const needleBase2 = polarToXY(needleAngle + 90, 10);

  return (
    <svg viewBox="0 0 320 200" width="100%" style={{ maxWidth: 380, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#00f57a" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="needleGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background track */}
      <path
        d={arcPath(START_ANGLE, START_ANGLE + SWEEP, R)}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={14}
        strokeLinecap="round"
      />

      {/* Colored fill arc */}
      {value > 0 && (
        <path
          d={arcPath(START_ANGLE, fillEnd, R)}
          fill="none"
          stroke={color}
          strokeWidth={14}
          strokeLinecap="round"
          filter="url(#glow)"
          style={{ transition: "all 0.08s linear" }}
        />
      )}

      {/* Tick marks & labels */}
      {TICK_LABELS.map((label) => {
        const scaledMax = max === UPLOAD_MAX ? UPLOAD_MAX : SCALE_MAX;
        const frac = label / scaledMax;
        if (frac > 1) return null;
        const angleDeg = START_ANGLE + frac * SWEEP;
        const outer = polarToXY(angleDeg, R + 8);
        const inner = polarToXY(angleDeg, R - 8);
        const labelPt = polarToXY(angleDeg, R + 22);
        const isMajor = label % 200 === 0 || label === 0;
        return (
          <g key={label}>
            <line
              x1={inner.x} y1={inner.y}
              x2={outer.x} y2={outer.y}
              stroke={isMajor ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"}
              strokeWidth={isMajor ? 2 : 1}
            />
            {isMajor && (
              <text
                x={labelPt.x} y={labelPt.y + 4}
                textAnchor="middle"
                fontSize="9"
                fill="rgba(255,255,255,0.45)"
                fontFamily="monospace"
              >
                {label}
              </text>
            )}
          </g>
        );
      })}

      {/* Sub-ticks every 50 */}
      {Array.from({ length: 20 }, (_, i) => i * 50).map((label) => {
        const scaledMax = max === UPLOAD_MAX ? UPLOAD_MAX : SCALE_MAX;
        const frac = label / scaledMax;
        if (frac > 1) return null;
        if (label % 100 === 0) return null; // already drawn
        const angleDeg = START_ANGLE + frac * SWEEP;
        const outer = polarToXY(angleDeg, R + 4);
        const inner = polarToXY(angleDeg, R - 4);
        return (
          <line key={`sub-${label}`}
            x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
            stroke="rgba(255,255,255,0.15)" strokeWidth={1}
          />
        );
      })}

      {/* Needle */}
      {(phase === "download" || phase === "upload") && (
        <polygon
          points={`${needleTip.x},${needleTip.y} ${needleBase1.x},${needleBase1.y} ${CX},${CY} ${needleBase2.x},${needleBase2.y}`}
          fill={color}
          opacity={0.9}
          filter="url(#needleGlow)"
          style={{ transition: "all 0.08s linear" }}
        />
      )}

      {/* Center hub */}
      <circle cx={CX} cy={CY} r={12} fill={phase === "idle" || phase === "done" ? "rgba(255,255,255,0.08)" : color} style={{ transition: "fill 0.3s" }} />
      <circle cx={CX} cy={CY} r={5} fill="#0b0e17" />

      {/* Center value */}
      <text x={CX} y={CY - 30} textAnchor="middle" fontSize="32" fontWeight="900" fill={phase === "download" || phase === "upload" ? color : "rgba(255,255,255,0.2)"} fontFamily="Montserrat, sans-serif" style={{ transition: "fill 0.3s" }}>
        {phase === "download" || phase === "upload" ? Math.round(value) : phase === "idle" ? "—" : ""}
      </text>
      <text x={CX} y={CY - 14} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.35)" fontFamily="sans-serif">
        {phase === "download" ? "Мбит/с  ↓  загрузка" : phase === "upload" ? "Мбит/с  ↑  отдача" : phase === "ping" ? "измеряю пинг..." : phase === "done" ? "тест завершён" : "готов"}
      </text>
    </svg>
  );
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function oscillate(target: number, elapsed: number, duration: number) {
  const base = easeInOutCubic(Math.min(elapsed / duration, 1)) * target;
  const noise = Math.sin(elapsed / 180) * target * 0.04 + Math.sin(elapsed / 70) * target * 0.02;
  return Math.max(0, base + noise);
}

export default function SpeedTestPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [results, setResults] = useState<Results>({ ping: null, download: null, upload: null });
  const [currentValue, setCurrentValue] = useState(0);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const targetRef = useRef(0);
  const durationRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");

  const DOWNLOAD_DURATION = 5500;
  const UPLOAD_DURATION = 4000;

  function startAnimate(target: number, duration: number, onDone: () => void) {
    targetRef.current = target;
    durationRef.current = duration;
    startTimeRef.current = performance.now();
    function tick(now: number) {
      const elapsed = now - startTimeRef.current;
      const val = oscillate(target, elapsed, duration);
      setCurrentValue(val);
      if (elapsed < duration) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setCurrentValue(target);
        onDone();
      }
    }
    animRef.current = requestAnimationFrame(tick);
  }

  function runTest() {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setResults({ ping: null, download: null, upload: null });
    setCurrentValue(0);
    phaseRef.current = "ping";
    setPhase("ping");

    const pingVal = Math.floor(Math.random() * 14) + 5;
    setTimeout(() => {
      setResults(r => ({ ...r, ping: pingVal }));
      phaseRef.current = "download";
      setPhase("download");
      setCurrentValue(0);
      const dlVal = parseFloat((Math.random() * 700 + 200).toFixed(1));
      startAnimate(dlVal, DOWNLOAD_DURATION, () => {
        setResults(r => ({ ...r, download: dlVal }));
        setCurrentValue(0);
        phaseRef.current = "upload";
        setPhase("upload");
        const ulVal = parseFloat((Math.random() * 250 + 80).toFixed(1));
        startAnimate(ulVal, UPLOAD_DURATION, () => {
          setResults(r => ({ ...r, upload: ulVal }));
          phaseRef.current = "done";
          setPhase("done");
        });
      });
    }, 1600);
  }

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current); }, []);

  const isRunning = phase === "ping" || phase === "download" || phase === "upload";
  const gaugeMax = phase === "upload" ? UPLOAD_MAX : SCALE_MAX;
  const gaugeColor = phase === "upload" ? "#00f57a" : "#00d4ff";

  const quality = (dl: number) => {
    if (dl >= 500) return { text: "Отлично", color: "#00f57a", hint: "подходит для любых задач" };
    if (dl >= 100) return { text: "Хорошо", color: "#00d4ff", hint: "комфортная работа и 4K видео" };
    if (dl >= 30) return { text: "Нормально", color: "#a855f7", hint: "стриминг HD без проблем" };
    return { text: "Слабо", color: "#f59e0b", hint: "стоит рассмотреть другой тариф" };
  };

  return (
    <div className="min-h-screen mesh-bg noise font-sans text-white">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-xl mx-auto">

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4 tracking-wider uppercase" style={{ borderColor: "rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.05)", color: "var(--neon-blue)" }}>
              <Icon name="Gauge" size={12} /> Замер скорости
            </div>
            <h1 className="font-montserrat font-black text-4xl md:text-5xl mb-2">
              Тест скорости <span className="gradient-text-blue">интернета</span>
            </h1>
            <p className="text-white/40 text-sm">Реальная скорость вашего подключения</p>
          </div>

          {/* Speedometer card */}
          <div className="glass-card rounded-3xl border border-white/5 px-6 pt-8 pb-6 flex flex-col items-center">

            {/* Ping indicator top */}
            <div className="flex items-center gap-2 mb-4 h-6">
              {results.ping !== null && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)", color: "#a855f7" }}>
                  <Icon name="Activity" size={11} />
                  Пинг: {results.ping} мс
                </div>
              )}
              {phase === "ping" && (
                <div className="flex items-center gap-1.5 text-xs text-white/40">
                  <div className="w-3 h-3 rounded-full border border-purple-400 border-t-transparent animate-spin" />
                  измеряю пинг...
                </div>
              )}
            </div>

            {/* Speedometer SVG */}
            <div className="w-full">
              <Speedometer value={currentValue} max={gaugeMax} color={gaugeColor} phase={phase} />
            </div>

            {/* Results row */}
            <div className="grid grid-cols-2 gap-3 w-full mt-2 mb-6">
              {[
                { label: "Загрузка", value: results.download, unit: "Мбит/с", icon: "Download", color: "#00d4ff", active: phase === "download" },
                { label: "Отдача", value: results.upload, unit: "Мбит/с", icon: "Upload", color: "#00f57a", active: phase === "upload" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl p-4 text-center transition-all duration-300"
                  style={{
                    background: item.active ? `${item.color}12` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${item.active ? item.color + "44" : "rgba(255,255,255,0.06)"}`,
                  }}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Icon name={item.icon as "Download"} size={13} style={{ color: item.value !== null ? item.color : "rgba(255,255,255,0.2)" }} />
                    <span className="text-white/40 text-xs">{item.label}</span>
                  </div>
                  <div className="font-montserrat font-black text-2xl" style={{ color: item.value !== null ? item.color : "rgba(255,255,255,0.15)" }}>
                    {item.value !== null ? item.value : "—"}
                    {item.value !== null && <span className="text-sm font-normal ml-1 text-white/40">{item.unit}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Quality badge */}
            {phase === "done" && results.download !== null && (
              <div className="mb-5 px-5 py-2.5 rounded-full text-sm font-semibold" style={{ background: `${quality(results.download).color}18`, border: `1px solid ${quality(results.download).color}44`, color: quality(results.download).color }}>
                {quality(results.download).text} — {quality(results.download).hint}
              </div>
            )}

            {/* CTA if slow */}
            {phase === "done" && results.download !== null && results.download < 100 && (
              <Link to="/tariffs" className="mb-4 text-xs text-white/40 hover:text-[#00d4ff] transition-colors underline underline-offset-2">
                Посмотреть тарифы с высокой скоростью →
              </Link>
            )}

            {/* Button */}
            <button
              onClick={runTest}
              disabled={isRunning}
              className="px-12 py-4 rounded-2xl font-montserrat font-black text-lg transition-all duration-300"
              style={{
                background: isRunning ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, var(--neon-blue), var(--neon-green))",
                color: isRunning ? "rgba(255,255,255,0.2)" : "#0b0e17",
                cursor: isRunning ? "not-allowed" : "pointer",
                boxShadow: isRunning ? "none" : "0 0 24px rgba(0,212,255,0.25)",
              }}
            >
              {phase === "idle" ? "Начать тест" : phase === "done" ? "Повторить" : "Идёт тест..."}
            </button>
          </div>

          {/* Info row */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: "Zap", title: "До 2.5 Гбит/с", desc: "на топовых тарифах", color: "#00d4ff" },
              { icon: "Clock", title: "Безлимит", desc: "без снижения скорости", color: "#00f57a" },
              { icon: "Shield", title: "SLA 99.9%", desc: "гарантированный uptime", color: "#a855f7" },
            ].map((c) => (
              <div key={c.title} className="glass-card rounded-2xl p-4 border border-white/5 text-center">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: `${c.color}18` }}>
                  <Icon name={c.icon as "Zap"} size={15} style={{ color: c.color }} />
                </div>
                <div className="font-bold text-xs mb-0.5">{c.title}</div>
                <div className="text-white/30 text-xs">{c.desc}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
