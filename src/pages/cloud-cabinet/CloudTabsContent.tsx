import Icon from "@/components/ui/icon";
import { Tab, CloudUser, CloudCamera, mockCameras, mockAlerts, mockArchive, plans } from "./constants";

interface CloudTabsContentProps {
  tab: Tab;
  user: CloudUser;
  setFullscreenCam: (c: CloudCamera | null) => void;
  payLoading: string | null;
  payError: string;
  startPayment: (planId: string) => void;
}

export default function CloudTabsContent({
  tab,
  user,
  setFullscreenCam,
  payLoading,
  payError,
  startPayment,
}: CloudTabsContentProps) {
  const onlineCams = mockCameras.filter((c) => c.status === "online").length;

  return (
    <div className="p-6">

      {/* ── TAB: CAMERAS ── */}
      {tab === "cameras" && (
        <div>
          {/* Summary row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Всего камер", value: mockCameras.length, color: "var(--neon-blue)", icon: "Camera" },
              { label: "Онлайн", value: onlineCams, color: "var(--neon-green)", icon: "Wifi" },
              { label: "Офлайн", value: mockCameras.length - onlineCams, color: "#ef4444", icon: "WifiOff" },
              { label: "Алертов сегодня", value: 3, color: "#fbbf24", icon: "Bell" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon name={s.icon} size={16} color={s.color} />
                  <span className="text-white/40 text-xs">{s.label}</span>
                </div>
                <span className="text-3xl font-black" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Camera grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {mockCameras.map((cam) => (
              <div key={cam.id} className="rounded-2xl overflow-hidden group"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                {/* Video */}
                <div className="relative" style={{ aspectRatio: "16/9", background: "#0a0c14" }}>
                  {cam.iframe && cam.status === "online" ? (
                    <iframe src={cam.iframe} className="absolute inset-0 w-full h-full" style={{ border: "none" }} allow="autoplay; fullscreen" allowFullScreen />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <Icon name={cam.status === "offline" ? "WifiOff" : "Camera"} size={36} color="rgba(255,255,255,0.1)" />
                      <span className="text-white/20 text-xs font-mono">{cam.status === "offline" ? "Нет сигнала" : "Нет трансляции"}</span>
                    </div>
                  )}
                  {/* scanlines */}
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)" }} />
                  {/* corners */}
                  {["tl", "tr", "bl", "br"].map((pos) => (
                    <div key={pos} className={`absolute w-4 h-4 ${pos.includes("t") ? "top-2" : "bottom-2"} ${pos.includes("l") ? "left-2" : "right-2"}`}
                      style={{
                        borderTop: pos.includes("t") ? `2px solid ${cam.color}` : undefined,
                        borderBottom: pos.includes("b") ? `2px solid ${cam.color}` : undefined,
                        borderLeft: pos.includes("l") ? `2px solid ${cam.color}` : undefined,
                        borderRight: pos.includes("r") ? `2px solid ${cam.color}` : undefined,
                      }} />
                  ))}
                  {/* status dot */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-lg"
                    style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: cam.status === "online" ? "#00f57a" : "#ef4444", animation: cam.status === "online" ? "pulse 2s infinite" : "none" }} />
                    <span className="text-xs font-mono text-white/70">{cam.status === "online" ? "ONLINE" : "OFFLINE"}</span>
                  </div>
                  {/* fullscreen btn */}
                  {cam.iframe && (
                    <button onClick={() => setFullscreenCam(cam)}
                      className="absolute bottom-3 right-3 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
                      <Icon name="Maximize2" size={14} color="white" />
                    </button>
                  )}
                </div>
                {/* Info */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-sm">{cam.name}</p>
                    <p className="text-white/35 text-xs mt-0.5">{cam.location} · {cam.resolution} · {cam.storage}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg transition-all hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                      <Icon name="Download" size={14} color="rgba(255,255,255,0.4)" />
                    </button>
                    <button className="p-2 rounded-lg transition-all hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                      <Icon name="Settings2" size={14} color="rgba(255,255,255,0.4)" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add camera button */}
          <button className="mt-4 w-full py-4 rounded-2xl font-bold text-sm transition-all hover:bg-white/5 flex items-center justify-center gap-2"
            style={{ border: "1px dashed rgba(0,212,255,0.25)", color: "rgba(0,212,255,0.5)" }}>
            <Icon name="Plus" size={18} color="rgba(0,212,255,0.5)" />
            Добавить камеру
          </button>
        </div>
      )}

      {/* ── TAB: ARCHIVE ── */}
      {tab === "archive" && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <select className="px-4 py-2 rounded-xl text-sm font-bold outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "white" }}>
              {mockCameras.map((c) => <option key={c.id} style={{ background: "#0b0d18" }}>{c.name}</option>)}
            </select>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
              <Icon name="Calendar" size={15} color="rgba(255,255,255,0.3)" />
              Апрель 2026
            </div>
          </div>
          <div className="space-y-4">
            {mockArchive.map((day) => (
              <div key={day.date} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-white font-bold mb-4 text-sm">{day.date}</p>
                <div className="space-y-2">
                  {day.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.02)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: "rgba(0,212,255,0.08)" }}>
                          <Icon name="Film" size={14} color="var(--neon-blue)" />
                        </div>
                        <span className="text-white/70 text-sm">{item}</span>
                      </div>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-white/5"
                        style={{ color: "var(--neon-blue)", border: "1px solid rgba(0,212,255,0.2)" }}>
                        <Icon name="Play" size={12} color="var(--neon-blue)" />
                        Смотреть
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: ALERTS ── */}
      {tab === "alerts" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-sm">5 уведомлений</p>
            <button className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
              Отметить все прочитанными
            </button>
          </div>
          <div className="space-y-3">
            {mockAlerts.map((alert) => {
              const typeConfig = {
                motion: { icon: "Activity", color: "var(--neon-blue)", bg: "rgba(0,212,255,0.08)" },
                person: { icon: "User", color: "var(--neon-purple)", bg: "rgba(168,85,247,0.08)" },
                offline: { icon: "WifiOff", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
              }[alert.type] ?? { icon: "Bell", color: "var(--neon-blue)", bg: "rgba(0,212,255,0.08)" };
              return (
                <div key={alert.id} className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: typeConfig.bg }}>
                    <Icon name={typeConfig.icon} size={18} color={typeConfig.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">{alert.text}</p>
                    <p className="text-white/35 text-xs mt-0.5">{alert.cam} · {alert.time}</p>
                  </div>
                  <button className="text-xs px-3 py-1.5 rounded-lg font-bold"
                    style={{ background: "rgba(0,212,255,0.08)", color: "var(--neon-blue)" }}>
                    Просмотр
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB: BILLING ── */}
      {tab === "billing" && (
        <div>
          {/* Current plan */}
          {(() => {
            const currentPlan = plans.find((p) => p.id === user?.plan) ?? plans[1];
            return (
              <div className="mb-8 p-6 rounded-2xl"
                style={{ background: "linear-gradient(135deg, rgba(0,245,122,0.07), rgba(0,212,255,0.04))", border: "1px solid rgba(0,245,122,0.2)" }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-black tracking-widest uppercase px-2 py-1 rounded-full"
                        style={{ background: "rgba(0,245,122,0.15)", color: "var(--neon-green)" }}>Активный тариф</span>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-1">{currentPlan.name}</h3>
                    <p className="text-white/40 text-sm">{currentPlan.cameras} камер · Архив {currentPlan.storage} · {currentPlan.price} ₽/мес</p>
                  </div>
                  <button
                    onClick={() => startPayment(currentPlan.id)}
                    disabled={!!payLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))", color: "#0b0e17" }}>
                    {payLoading === currentPlan.id
                      ? <Icon name="Loader2" size={16} color="#0b0e17" />
                      : <Icon name="RefreshCw" size={16} color="#0b0e17" />}
                    Продлить тариф
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Error */}
          {payError && (
            <div className="mb-6 flex items-center gap-2 p-3 rounded-xl"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <Icon name="AlertCircle" size={15} color="#ef4444" />
              <p className="text-red-400 text-sm">{payError}</p>
            </div>
          )}

          {/* Plans */}
          <h3 className="text-white font-bold mb-4 text-sm">Сменить тариф</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {plans.map((plan) => {
              const isCurrent = plan.id === user?.plan;
              return (
                <div key={plan.id} className="rounded-2xl p-5 transition-all"
                  style={{
                    background: isCurrent ? "rgba(0,212,255,0.05)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isCurrent ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.06)"}`,
                  }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-black text-white">{plan.name}</span>
                    {isCurrent && <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background: "rgba(0,212,255,0.1)", color: "var(--neon-blue)" }}>Текущий</span>}
                  </div>
                  <p className="text-2xl font-black text-white mb-1">{plan.price} ₽<span className="text-white/30 text-sm font-normal">/мес</span></p>
                  <p className="text-white/35 text-xs mb-4">{plan.cameras} камер · {plan.storage}</p>
                  <button
                    onClick={() => !isCurrent && startPayment(plan.id)}
                    disabled={isCurrent || !!payLoading}
                    className="w-full py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:cursor-default"
                    style={isCurrent
                      ? { background: "rgba(0,212,255,0.08)", color: "var(--neon-blue)" }
                      : { background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))", color: "#0b0e17" }}>
                    {payLoading === plan.id && <Icon name="Loader2" size={14} color="#0b0e17" />}
                    {isCurrent ? "Активен" : "Оплатить"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Robokassa badge */}
          <div className="flex items-center gap-2 mb-6 text-white/20 text-xs">
            <Icon name="ShieldCheck" size={14} color="rgba(255,255,255,0.2)" />
            Оплата через Robokassa — Visa, Mastercard, МИР, СБП, ЮMoney
          </div>
        </div>
      )}

      {/* ── TAB: SETTINGS ── */}
      {tab === "settings" && (
        <div className="max-w-2xl space-y-6">
          {[
            { title: "Профиль", fields: [{ label: "Имя", value: "Иван Кузнецов" }, { label: "Email", value: "ivan@example.com" }, { label: "Телефон", value: "+7 900 000-00-00" }] },
            { title: "Уведомления", fields: [] },
            { title: "Безопасность", fields: [] },
          ].map((section) => (
            <div key={section.title} className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-white font-bold mb-5">{section.title}</h3>
              {section.fields.length > 0 ? (
                <div className="space-y-4">
                  {section.fields.map((f) => (
                    <div key={f.label}>
                      <label className="text-white/40 text-xs mb-1.5 block">{f.label}</label>
                      <input defaultValue={f.value}
                        className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all focus:border-blue-500/50"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
                    </div>
                  ))}
                  <button className="mt-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105"
                    style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))", color: "#0b0e17" }}>
                    Сохранить
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {section.title === "Уведомления" && [
                    ["Уведомления о движении", true],
                    ["Уведомления о людях", true],
                    ["Уведомление при отключении камеры", true],
                    ["Email-дайджест", false],
                  ].map(([label, on]) => (
                    <div key={label as string} className="flex items-center justify-between py-2">
                      <span className="text-white/70 text-sm">{label as string}</span>
                      <div className="w-10 h-5 rounded-full relative cursor-pointer"
                        style={{ background: on ? "var(--neon-blue)" : "rgba(255,255,255,0.1)" }}>
                        <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                          style={{ left: on ? "calc(100% - 18px)" : "2px" }} />
                      </div>
                    </div>
                  ))}
                  {section.title === "Безопасность" && (
                    <div className="space-y-3">
                      <button className="w-full py-3 rounded-xl text-sm font-bold text-left px-4 transition-all hover:bg-white/5 flex items-center justify-between"
                        style={{ border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}>
                        <span>Изменить пароль</span>
                        <Icon name="ChevronRight" size={16} color="rgba(255,255,255,0.2)" />
                      </button>
                      <button className="w-full py-3 rounded-xl text-sm font-bold text-left px-4 transition-all hover:bg-white/5 flex items-center justify-between"
                        style={{ border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}>
                        <span>Двухфакторная аутентификация</span>
                        <Icon name="ChevronRight" size={16} color="rgba(255,255,255,0.2)" />
                      </button>
                      <button className="w-full py-3 rounded-xl text-sm font-bold text-left px-4 transition-all hover:bg-red-500/10 flex items-center justify-between"
                        style={{ border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444" }}>
                        <span>Удалить аккаунт</span>
                        <Icon name="Trash2" size={16} color="#ef4444" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
