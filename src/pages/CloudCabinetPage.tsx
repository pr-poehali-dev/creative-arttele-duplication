import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import CloudSidebar from "./cloud-cabinet/CloudSidebar";
import CloudTabsContent from "./cloud-cabinet/CloudTabsContent";
import CloudFullscreenModal from "./cloud-cabinet/CloudFullscreenModal";
import { PAY_URL, Tab, CloudUser, CloudCamera, navItems } from "./cloud-cabinet/constants";

export default function CloudCabinetPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("cameras");
  const [fullscreenCam, setFullscreenCam] = useState<CloudCamera | null>(null);
  const [user, setUser] = useState<CloudUser | null>(null);
  const [payLoading, setPayLoading] = useState<string | null>(null);
  const [payError, setPayError] = useState("");

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

  const startPayment = useCallback(async (planId: string) => {
    if (user?.is_demo) { setPayError("В демо-режиме оплата недоступна. Зарегистрируйтесь."); return; }
    setPayError("");
    setPayLoading(planId);
    try {
      const token = localStorage.getItem("cv_token") || "";
      const res = await fetch(`${PAY_URL}?action=create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ plan_id: planId }),
      });
      const data = await res.json();
      if (!res.ok) { setPayError(data.error || "Ошибка создания платежа"); return; }
      window.location.href = data.pay_url;
    } catch {
      setPayError("Ошибка соединения. Попробуйте ещё раз.");
    } finally {
      setPayLoading(null);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex" style={{ background: "#07080f" }}>

      {/* ── SIDEBAR ── */}
      <CloudSidebar tab={tab} setTab={setTab} user={user} onLogout={logout} />

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

        <CloudTabsContent
          tab={tab}
          user={user}
          setFullscreenCam={setFullscreenCam}
          payLoading={payLoading}
          payError={payError}
          startPayment={startPayment}
        />
      </main>

      {/* ── FULLSCREEN MODAL ── */}
      <CloudFullscreenModal fullscreenCam={fullscreenCam} setFullscreenCam={setFullscreenCam} />
    </div>
  );
}
