export const SPEED_TEST_ORIGIN = typeof window !== "undefined" ? window.location.origin : "";

export type Phase = "idle" | "ping" | "download" | "upload" | "done";
export interface Results { ping: number | null; download: number | null; upload: number | null; }
export interface HistoryEntry { ping: number; download: number; upload: number; time: string; }

export const CX = 160, CY = 170, R = 130;
export const START_ANGLE = 180; // left
export const SWEEP = 180;       // half circle, left → right

export function degToRad(d: number) { return (d * Math.PI) / 180; }

export function polarToXY(angleDeg: number, r: number) {
  const a = degToRad(angleDeg);
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

export function arcPath(startDeg: number, endDeg: number, r: number) {
  const s = polarToXY(startDeg, r);
  const e = polarToXY(endDeg, r);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export const SCALE_MAX = 1000;
export const UPLOAD_MAX = 400;

// Color interpolation: green → yellow → red by progress
export function progressColor(p: number): string {
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

export const DL_LABELS = [0, 200, 400, 600, 800, 1000];
export const UL_LABELS = [0, 80, 160, 240, 320, 400];
