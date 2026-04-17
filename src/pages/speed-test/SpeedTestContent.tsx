import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Speedometer from "./Speedometer";
import { Phase, Results, HistoryEntry, SCALE_MAX, UPLOAD_MAX, progressColor } from "./constants";

interface SpeedTestContentProps {
  phase: Phase;
  results: Results;
  currentValue: number;
  history: HistoryEntry[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>;
  runTest: () => void;
}

const quality = (dl: number) => {
  if (dl >= 500) return { text: "Отлично", color: "#00f57a", hint: "подходит для любых задач" };
  if (dl >= 100) return { text: "Хорошо", color: "#00d4ff", hint: "комфортная работа и 4K видео" };
  if (dl >= 30) return { text: "Нормально", color: "#a855f7", hint: "стриминг HD без проблем" };
  return { text: "Слабо", color: "#f59e0b", hint: "стоит рассмотреть другой тариф" };
};

export default function SpeedTestContent({
  phase,
  results,
  currentValue,
  history,
  setHistory,
  runTest,
}: SpeedTestContentProps) {
  const isRunning = phase === "ping" || phase === "download" || phase === "upload";
  const gaugeMax = phase === "upload" ? UPLOAD_MAX : SCALE_MAX;
   
  const _needleColor = progressColor(Math.min(currentValue / gaugeMax, 1));

  return (
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

      {/* История замеров */}
      {history.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-white/50 text-sm font-semibold">
              <Icon name="History" size={14} />
              История замеров
            </div>
            <button
              onClick={() => {
                setHistory([]);
                try { localStorage.removeItem("speedtest_history"); } catch (_) { /* ignore */ }
              }}
              className="text-xs text-white/25 hover:text-white/50 transition-colors"
            >
              Очистить
            </button>
          </div>

          <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
            {/* Шапка */}
            <div className="grid grid-cols-4 px-4 py-2 border-b border-white/5">
              {["Время", "↓ Загрузка", "↑ Отдача", "Пинг"].map(h => (
                <div key={h} className="text-white/25 text-xs text-center">{h}</div>
              ))}
            </div>

            {history.map((row, i) => {
              const q = quality(row.download);
              return (
                <div key={i}
                  className="grid grid-cols-4 px-4 py-3 items-center transition-colors hover:bg-white/[0.02]"
                  style={{ borderBottom: i < history.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div className="text-white/35 text-xs text-center">{row.time}</div>
                  <div className="text-center">
                    <span className="font-montserrat font-bold text-sm" style={{ color: q.color }}>
                      {row.download >= 1000 ? (row.download / 1000).toFixed(1) + " Гбит/с" : row.download + " Мбит/с"}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="font-montserrat font-bold text-sm text-[#00f57a]">
                      {row.upload} Мбит/с
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-semibold" style={{ color: "#a855f7" }}>{row.ping} мс</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
