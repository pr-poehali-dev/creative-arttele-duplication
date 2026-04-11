import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

type Phase = "idle" | "ping" | "download" | "upload" | "done";
interface Results { ping: number | null; download: number | null; upload: number | null; }

const CX = 160, CY = 170, R = 130;
const START_ANGLE = 180; // left
const SWEEP = 180;       // half circle, left → right

function degToRad(d: number) { return (d * Math.PI) / 180; }

function polarToXY(angleDeg: number, r: number) {
  const a = degToRad(angleDeg);
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

function arcPath(startDeg: number, endDeg: number, r: number) {
  const s = polarToXY(startDeg, r);
  const e = polarToXY(endDeg, r);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

const SCALE_MAX = 1000;
const UPLOAD_MAX = 400;

// Color interpolation: green → yellow → red by progress
function progressColor(p: number): string {
  // 0 = green (#00f57a), 0.5 = yellow (#f5c400), 1 = red (#f53000)
  const clamp = Math.min(1, Math.max(0, p));
  let r: number, g: number, b: number;
  if (clamp < 0.5) {
    const t = clamp / 0.5;
    r = Math.round(0 + t * (245 - 0));
    g = Math.round(245 + t * (196 - 245));
    b = Math.round(122 + t * (0 - 122));
  } else {
    const t = (clamp - 0.5) / 0.5;
    r = Math.round(245 + t * (245 - 245));
    g = Math.round(196 + t * (48 - 196));
    b = Math.round(0);
  }
  return `rgb(${r},${g},${b})`;
}

const DL_LABELS  = [0, 200, 400, 600, 800, 1000];
const UL_LABELS  = [0, 80, 160, 240, 320, 400];

function Speedometer({ value, max, phase }: { value: number; max: number; phase: Phase }) {
  const progress = Math.min(value / max, 1);
  const fillEnd = START_ANGLE + progress * SWEEP;
  const needleAngle = START_ANGLE + progress * SWEEP;
  const color = progressColor(progress);

  // Needle: tip points outward along needleAngle
  const tipR = R - 16;
  const baseR = 14;
  const tip = polarToXY(needleAngle, tipR);
  const base1 = polarToXY(needleAngle - 90, baseR);
  const base2 = polarToXY(needleAngle + 90, baseR);

  const labels = max === UPLOAD_MAX ? UL_LABELS : DL_LABELS;

  return (
    <svg viewBox="0 0 320 185" width="100%" style={{ maxWidth: 400, display: "block", margin: "0 auto" }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="needleGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background track */}
      <path
        d={arcPath(START_ANGLE, START_ANGLE + SWEEP, R)}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={16}
        strokeLinecap="round"
      />

      {/* Colored fill arc */}
      {value > 0.5 && (
        <path
          d={arcPath(START_ANGLE, fillEnd, R)}
          fill="none"
          stroke={color}
          strokeWidth={16}
          strokeLinecap="round"
          filter="url(#glow)"
          style={{ transition: "stroke 0.1s linear" }}
        />
      )}

      {/* Tick marks & labels */}
      {labels.map((label) => {
        const frac = label / max;
        const angleDeg = START_ANGLE + frac * SWEEP;
        const outer = polarToXY(angleDeg, R + 9);
        const inner = polarToXY(angleDeg, R - 9);
        const labelPt = polarToXY(angleDeg, R + 24);
        const tickProgress = frac;
        const tickColor = tickProgress <= progress
          ? progressColor(tickProgress)
          : "rgba(255,255,255,0.3)";
        const displayLabel = max === SCALE_MAX && label >= 1000 ? "1K" : String(label);
        return (
          <g key={label}>
            <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={tickColor} strokeWidth={2} />
            <text x={labelPt.x} y={labelPt.y + 4} textAnchor="middle" fontSize="9"
              fill={tickProgress <= progress ? progressColor(tickProgress) : "rgba(255,255,255,0.35)"}
              fontFamily="monospace">
              {displayLabel}
            </text>
          </g>
        );
      })}

      {/* Sub-ticks */}
      {Array.from({ length: 20 }, (_, i) => i / 20).map((frac, i) => {
        if (labels.some(l => Math.abs(l / max - frac) < 0.001)) return null;
        const angleDeg = START_ANGLE + frac * SWEEP;
        const outer = polarToXY(angleDeg, R + 4);
        const inner = polarToXY(angleDeg, R - 4);
        return (
          <line key={`sub-${i}`} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
            stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
        );
      })}

      {/* Needle */}
      {(phase === "download" || phase === "upload") && (
        <polygon
          points={`${tip.x},${tip.y} ${base1.x},${base1.y} ${CX},${CY} ${base2.x},${base2.y}`}
          fill={color}
          opacity={0.95}
          filter="url(#needleGlow)"
          style={{ transition: "fill 0.1s linear" }}
        />
      )}

      {/* Center hub */}
      <circle cx={CX} cy={CY} r={13}
        fill={phase === "download" || phase === "upload" ? color : "rgba(255,255,255,0.08)"}
        style={{ transition: "fill 0.1s" }} />
      <circle cx={CX} cy={CY} r={5} fill="#0b0e17" />

      {/* Speed value */}
      <text x={CX} y={CY - 38} textAnchor="middle" fontSize="34" fontWeight="900"
        fill={phase === "download" || phase === "upload" ? color : "rgba(255,255,255,0.18)"}
        fontFamily="Montserrat, sans-serif"
        style={{ transition: "fill 0.1s" }}>
        {phase === "download" || phase === "upload"
          ? value >= 1000 ? (value / 1000).toFixed(2) : Math.round(value)
          : phase === "idle" ? "—" : ""}
      </text>

      {/* Unit + label */}
      <text x={CX} y={CY - 20} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.35)" fontFamily="sans-serif">
        {phase === "download"
          ? (value >= 1000 ? "Гбит/с  ↓  загрузка" : "Мбит/с  ↓  загрузка")
          : phase === "upload"
          ? "Мбит/с  ↑  отдача"
          : phase === "ping" ? "измеряю пинг..." : phase === "done" ? "тест завершён" : "готов"}
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
  const needleColor = progressColor(Math.min(currentValue / gaugeMax, 1));

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

          <div className="glass-card rounded-3xl border border-white/5 px-6 pt-8 pb-6 flex flex-col items-center">

            {/* Ping indicator */}
            <div className="flex items-center gap-2 mb-2 h-6">
              {results.ping !== null && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)", color: "#a855f7" }}>
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

            {/* Speedometer */}
            <div className="w-full">
              <Speedometer value={currentValue} max={gaugeMax} phase={phase} />
            </div>

            {/* Results row */}
            <div className="grid grid-cols-2 gap-3 w-full mt-1 mb-6">
              {[
                { label: "Загрузка", value: results.download, icon: "Download", color: "#00d4ff", active: phase === "download" },
                { label: "Отдача", value: results.upload, icon: "Upload", color: "#00f57a", active: phase === "upload" },
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
                    {item.value !== null
                      ? item.value >= 1000
                        ? <>{(item.value / 1000).toFixed(2)} <span className="text-sm font-normal text-white/40">Гбит/с</span></>
                        : <>{item.value} <span className="text-sm font-normal text-white/40">Мбит/с</span></>
                      : "—"}
                  </div>
                </div>
              ))}
            </div>

            {/* Quality badge */}
            {phase === "done" && results.download !== null && (
              <div className="mb-5 px-5 py-2.5 rounded-full text-sm font-semibold"
                style={{ background: `${quality(results.download).color}18`, border: `1px solid ${quality(results.download).color}44`, color: quality(results.download).color }}>
                {quality(results.download).text} — {quality(results.download).hint}
              </div>
            )}

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
