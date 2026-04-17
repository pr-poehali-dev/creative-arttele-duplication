import {
  Phase,
  CX, CY, R, START_ANGLE, SWEEP,
  polarToXY, arcPath, progressColor,
  SCALE_MAX, UPLOAD_MAX, DL_LABELS, UL_LABELS,
} from "./constants";

export default function Speedometer({ value, max, phase }: { value: number; max: number; phase: Phase }) {
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
