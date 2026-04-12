import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const AUTH_URL = "https://functions.poehali.dev/6804ae8c-e934-4844-ba4e-c1607f399f66";

export default function CloudLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function doLogin(e: React.FormEvent, demoMode = false) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const loginEmail = demoMode ? "demo@cloudvideo.ru" : email;
    const loginPass = demoMode ? "demo123" : password;

    try {
      const res = await fetch(`${AUTH_URL}?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка входа");
        return;
      }
      localStorage.setItem("cv_token", data.token);
      localStorage.setItem("cv_user", JSON.stringify(data.user));
      navigate("/video/cabinet");
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#07080f" }}>
      {/* bg blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[120px]" style={{ background: "var(--neon-blue)" }} />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full opacity-[0.06] blur-[100px]" style={{ background: "var(--neon-purple)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/video/cloud" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))", boxShadow: "0 0 30px rgba(0,212,255,0.3)" }}>
              <Icon name="Eye" size={22} color="#0b0e17" />
            </div>
            <div className="text-left">
              <p className="font-black text-white text-xl leading-none">CloudVideo</p>
              <p className="text-white/30 text-xs">Облачное видеонаблюдение</p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
          <h1 className="text-2xl font-black text-white mb-1">Войти в кабинет</h1>
          <p className="text-white/35 text-sm mb-8">Управляй камерами из любой точки мира</p>

          {/* Demo banner */}
          <button
            type="button"
            onClick={(e) => doLogin(e, true)}
            disabled={loading}
            className="w-full mb-6 p-4 rounded-2xl text-left transition-all hover:-translate-y-0.5 group"
            style={{ background: "linear-gradient(135deg, rgba(0,245,122,0.08), rgba(0,212,255,0.06))", border: "1px solid rgba(0,245,122,0.25)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(0,245,122,0.15)" }}>
                <Icon name="PlayCircle" size={18} color="var(--neon-green)" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">Демо-режим — без регистрации</p>
                <p className="text-white/40 text-xs">Посмотри все функции кабинета прямо сейчас</p>
              </div>
              <Icon name="ArrowRight" size={16} color="rgba(0,245,122,0.5)" />
            </div>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-white/25 text-xs">или войди по email</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          <form onSubmit={doLogin} className="space-y-4">
            <div>
              <label className="text-white/40 text-xs mb-1.5 block">Email</label>
              <div className="relative">
                <Icon name="Mail" size={16} color="rgba(255,255,255,0.25)" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all placeholder:text-white/20"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Icon name="Mail" size={16} color="rgba(255,255,255,0.25)" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-white/40 text-xs mb-1.5 block">Пароль</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-white text-sm outline-none transition-all placeholder:text-white/20"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Icon name="Lock" size={16} color="rgba(255,255,255,0.25)" />
                </div>
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Icon name={showPass ? "EyeOff" : "Eye"} size={16} color="rgba(255,255,255,0.25)" />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <Icon name="AlertCircle" size={15} color="#ef4444" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-black text-sm transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))", color: "#0b0e17", boxShadow: "0 0 30px rgba(0,212,255,0.2)" }}>
              {loading ? <Icon name="Loader2" size={18} color="#0b0e17" /> : <Icon name="LogIn" size={18} color="#0b0e17" />}
              {loading ? "Входим..." : "Войти"}
            </button>
          </form>
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-white/25">
          <Link to="/video/cloud" className="hover:text-white/50 transition-colors">О сервисе</Link>
          <span>·</span>
          <Link to="/video/cloud#pricing" className="hover:text-white/50 transition-colors">Тарифы</Link>
          <span>·</span>
          <Link to="/contacts" className="hover:text-white/50 transition-colors">Поддержка</Link>
        </div>
      </div>
    </div>
  );
}
