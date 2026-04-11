import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import banners from "@/data/banners";

const INTERVAL_MS = 5000;   // смена баннера каждые 5 сек
const SHOW_DELAY_MS = 2000; // появление через 2 сек после загрузки страницы

export default function FloatingBanners() {
  const active = banners.filter(b => b.enabled);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const [paused, setPaused] = useState(false);

  // Показываем через SHOW_DELAY_MS после монтирования
  useEffect(() => {
    if (active.length === 0) return;
    const t = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, [active.length]);

  // Автопрокрутка баннеров
  const next = useCallback(() => {
    setCurrent(c => (c + 1) % active.length);
  }, [active.length]);

  useEffect(() => {
    if (!visible || paused || active.length <= 1) return;
    const t = setInterval(next, INTERVAL_MS);
    return () => clearInterval(t);
  }, [visible, paused, next, active.length]);

  if (active.length === 0 || closed) return null;

  const banner = active[current];

  return (
    <div
      className="fixed bottom-6 right-6 z-40 transition-all duration-500"
      style={{
        transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Закрыть */}
      <button
        onClick={() => setClosed(true)}
        className="absolute -top-2.5 -right-2.5 z-10 w-6 h-6 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
        style={{ background: "#1a1f2e", border: "1px solid rgba(255,255,255,0.15)" }}
        aria-label="Закрыть"
      >
        <Icon name="X" size={12} />
      </button>

      {/* Баннер */}
      <Link to={banner.link} className="block group">
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl transition-transform duration-200 group-hover:scale-[1.02]"
          style={{
            width: 240,
            border: "1px solid rgba(0,212,255,0.25)",
            boxShadow: "0 0 30px rgba(0,212,255,0.15), 0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <img
            src={banner.img}
            alt={banner.alt}
            className="w-full block"
            style={{ height: 160, objectFit: "cover" }}
          />
          {/* Нижний градиент */}
          <div
            className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center justify-between"
            style={{ background: "linear-gradient(to top, rgba(11,14,23,0.95), transparent)" }}
          >
            <span className="text-xs font-semibold text-white/80">{banner.alt}</span>
            <Icon name="ArrowRight" size={13} style={{ color: "var(--neon-blue)" }} />
          </div>
        </div>
      </Link>

      {/* Точки навигации (если баннеров > 1) */}
      {active.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {active.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 16 : 6,
                height: 6,
                background: i === current ? "var(--neon-blue)" : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
