import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

type Tab = "cameras" | "archive" | "alerts" | "billing" | "settings";

const mockCameras = [
  { id: 1, name: "Вход — Камера 1", location: "Главный вход", status: "online", resolution: "1080p", storage: "7 дней", iframe: "https://vkvideo.ru/video_ext.php?oid=-104158648&id=456239679&hash=", color: "#00d4ff" },
  { id: 2, name: "Парковка — Камера 2", location: "Паркинг Б-1", status: "online", resolution: "4K", storage: "30 дней", iframe: "https://vkvideo.ru/video_ext.php?oid=-105329382&id=456240514&hd=2&autoplay=1", color: "#00f57a" },
  { id: 3, name: "Склад — Камера 3", location: "Склад №2", status: "offline", resolution: "1080p", storage: "7 дней", iframe: null, color: "#ef4444" },
  { id: 4, name: "Офис — Камера 4", location: "Кабинет директора", status: "online", resolution: "4K", storage: "30 дней", iframe: null, color: "#a855f7" },
];

const mockAlerts = [
  { id: 1, cam: "Вход — Камера 1", time: "Сегодня, 14:32", type: "motion", text: "Обнаружено движение" },
  { id: 2, cam: "Парковка — Камера 2", time: "Сегодня, 12:15", type: "person", text: "Обнаружен человек" },
  { id: 3, cam: "Склад — Камера 3", time: "Вчера, 23:47", type: "offline", text: "Камера отключилась" },
  { id: 4, cam: "Вход — Камера 1", time: "Вчера, 09:10", type: "motion", text: "Обнаружено движение" },
  { id: 5, cam: "Офис — Камера 4", time: "12 апр, 18:00", type: "person", text: "Обнаружен человек" },
];

const mockArchive = [
  { date: "Сегодня", items: ["14:32 — Движение (2 мин)", "10:15 — Движение (45 сек)", "08:02 — Вход в зону (1 мин)"] },
  { date: "Вчера", items: ["23:47 — Камера офлайн", "17:30 — Движение (3 мин)", "09:10 — Движение (1 мин)"] },
  { date: "10 апреля", items: ["20:15 — Движение (2 мин)", "13:00 — Человек в зоне (5 мин)"] },
];

const plans = [
  { id: "start", name: "Старт", price: 490, cameras: 2, storage: "7 дней", current: false },
  { id: "pro", name: "Про", price: 1290, cameras: 8, storage: "30 дней", current: true },
  { id: "business", name: "Бизнес", price: 3900, cameras: 32, storage: "90 дней", current: false },
];

const navItems: { id: Tab; icon: string; label: string }[] = [
  { id: "cameras", icon: "Camera", label: "Камеры" },
  { id: "archive", icon: "Film", label: "Архив" },
  { id: "alerts", icon: "Bell", label: "Алерты" },
  { id: "billing", icon: "CreditCard", label: "Тариф" },
  { id: "settings", icon: "Settings", label: "Настройки" },
];

export default function CloudCabinetPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("cameras");
  const [fullscreenCam, setFullscreenCam] = useState<(typeof mockCameras)[0] | null>(null);
  const [user, setUser] = useState<{ name: string; email: string; plan: string; is_demo: boolean } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("cv_user");
    if (!stored) {
      navigate("/video/login");
      return;
    }
    try {
      setUser(JSON.parse(stored));
    } catch {
      navigate("/video/login");
    }
  }, [navigate]);

  function logout() {
    localStorage.removeItem("cv_token");
    localStorage.removeItem("cv_user");
    navigate("/video/login");
  }

  if (!user) return null;

  const onlineCams = mockCameras.filter((c) => c.status === "online").length;

  return (
    <div className="min-h-screen flex" style={{ background: "#07080f" }}>

      {/* ── SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 flex-shrink-0"
        style={{ background: "#0b0d18", borderRight: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Logo */}
        <div className="p-6 mb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <Link to="/video/cloud" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}>
              <Icon name="Eye" size={16} color="#0b0e17" />
            </div>
            <span className="font-black text-white text-sm">CloudVideo</span>
          </Link>
        </div>

        {/* Status chip */}
        <div className="mx-4 mb-6 px-4 py-3 rounded-xl" style={{ background: "rgba(0,245,122,0.07)", border: "1px solid rgba(0,245,122,0.15)" }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00f57a" }} />
            <span className="text-xs font-bold" style={{ color: "var(--neon-green)" }}>Система активна</span>
          </div>
          <p className="text-white/30 text-xs">{onlineCams} из {mockCameras.length} камер онлайн</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left"
              style={tab === item.id
                ? { background: "rgba(0,212,255,0.1)", color: "var(--neon-blue)", border: "1px solid rgba(0,212,255,0.2)" }
                : { color: "rgba(255,255,255,0.4)", border: "1px solid transparent" }}>
              <Icon name={item.icon} size={17} color={tab === item.id ? "var(--neon-blue)" : "rgba(255,255,255,0.3)"} />
              {item.label}
              {item.id === "alerts" && (
                <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-black"
                  style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444" }}>3</span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 m-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))", color: "white" }}>
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">{user.name}</p>
              <p className="text-white/30 text-xs">Тариф {user.plan === "pro" ? "Про" : user.plan}</p>
            </div>
            <button onClick={logout} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
              <Icon name="LogOut" size={15} color="rgba(255,255,255,0.4)" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
          style={{ background: "rgba(7,8,15,0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <h1 className="text-white font-black text-lg">
              {navItems.find((n) => n.id === tab)?.label}
            </h1>
            <p className="text-white/30 text-xs">Личный кабинет</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile nav */}
            <div className="flex md:hidden gap-1">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className="p-2 rounded-lg transition-all"
                  style={tab === item.id ? { background: "rgba(0,212,255,0.1)", color: "var(--neon-blue)" } : { color: "rgba(255,255,255,0.3)" }}>
                  <Icon name={item.icon} size={18} color={tab === item.id ? "var(--neon-blue)" : undefined} />
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#ef4444" }} />
              <span className="text-xs font-mono" style={{ color: "var(--neon-blue)" }}>LIVE</span>
            </div>
            <Link to="/video/cloud"
              className="hidden md:flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Icon name="ArrowLeft" size={13} />
              На сайт
            </Link>
          </div>
        </div>

        {/* Demo banner */}
        {user.is_demo && (
          <div className="mx-6 mt-4 flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(245,158,11,0.05))", border: "1px solid rgba(251,191,36,0.25)" }}>
            <Icon name="Info" size={16} color="#fbbf24" />
            <p className="text-sm flex-1" style={{ color: "rgba(251,191,36,0.85)" }}>
              <b>Демо-режим</b> — все функции доступны для просмотра. Данные ненастоящие.
            </p>
            <Link to="/video/cloud#pricing"
              className="text-xs font-black px-3 py-1.5 rounded-lg flex-shrink-0"
              style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
              Купить тариф
            </Link>
          </div>
        )}

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
              <div className="mb-8 p-6 rounded-2xl"
                style={{ background: "linear-gradient(135deg, rgba(0,245,122,0.07), rgba(0,212,255,0.04))", border: "1px solid rgba(0,245,122,0.2)" }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-black tracking-widest uppercase px-2 py-1 rounded-full"
                        style={{ background: "rgba(0,245,122,0.15)", color: "var(--neon-green)" }}>Активный тариф</span>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-1">Про</h3>
                    <p className="text-white/40 text-sm">8 камер · Архив 30 дней · 4K · 1 290 ₽/мес</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/30 text-xs mb-1">Следующее списание</p>
                    <p className="text-white font-bold">1 мая 2026</p>
                    <p className="text-white/40 text-xs mt-1">Осталось 19 дней</p>
                  </div>
                </div>
              </div>

              {/* Plans */}
              <h3 className="text-white font-bold mb-4 text-sm">Сменить тариф</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {plans.map((plan) => (
                  <div key={plan.id} className="rounded-2xl p-5 transition-all"
                    style={{
                      background: plan.current ? "rgba(0,212,255,0.05)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${plan.current ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.06)"}`,
                    }}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-black text-white">{plan.name}</span>
                      {plan.current && <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background: "rgba(0,212,255,0.1)", color: "var(--neon-blue)" }}>Текущий</span>}
                    </div>
                    <p className="text-2xl font-black text-white mb-1">{plan.price} ₽<span className="text-white/30 text-sm font-normal">/мес</span></p>
                    <p className="text-white/35 text-xs mb-4">{plan.cameras} камеры · {plan.storage}</p>
                    <button className="w-full py-2 rounded-xl text-sm font-bold transition-all"
                      style={plan.current
                        ? { background: "rgba(0,212,255,0.08)", color: "var(--neon-blue)", cursor: "default" }
                        : { border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
                      {plan.current ? "Активен" : "Выбрать"}
                    </button>
                  </div>
                ))}
              </div>

              {/* Payment history */}
              <h3 className="text-white font-bold mb-4 text-sm">История платежей</h3>
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                {[
                  { date: "1 апр 2026", amount: "1 290 ₽", status: "ok", desc: "Тариф Про" },
                  { date: "1 мар 2026", amount: "1 290 ₽", status: "ok", desc: "Тариф Про" },
                  { date: "1 фев 2026", amount: "1 290 ₽", status: "ok", desc: "Тариф Про" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-4"
                    style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none", background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                    <div>
                      <p className="text-white text-sm font-bold">{row.desc}</p>
                      <p className="text-white/30 text-xs">{row.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold">{row.amount}</span>
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(0,245,122,0.1)", color: "var(--neon-green)" }}>Оплачено</span>
                    </div>
                  </div>
                ))}
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
      </main>

      {/* ── FULLSCREEN MODAL ── */}
      {fullscreenCam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}
          onClick={() => setFullscreenCam(null)}>
          <div className="w-full max-w-5xl rounded-3xl overflow-hidden" onClick={(e) => e.stopPropagation()}
            style={{ border: "1px solid rgba(0,212,255,0.2)" }}>
            <div className="flex items-center justify-between px-5 py-3"
              style={{ background: "#0d0f1a", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#ef4444" }} />
                <span className="text-white/60 text-sm font-mono">{fullscreenCam.name}</span>
              </div>
              <button onClick={() => setFullscreenCam(null)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <Icon name="X" size={18} color="rgba(255,255,255,0.5)" />
              </button>
            </div>
            <div className="relative" style={{ aspectRatio: "16/9", background: "#0a0c14" }}>
              <iframe src={fullscreenCam.iframe!} className="absolute inset-0 w-full h-full" style={{ border: "none" }} allow="autoplay; fullscreen" allowFullScreen />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}