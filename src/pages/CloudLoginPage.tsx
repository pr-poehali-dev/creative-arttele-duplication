import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const AUTH_URL = "https://functions.poehali.dev/6804ae8c-e934-4844-ba4e-c1607f399f66";

type Mode = "login" | "register";

export default function CloudLoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  function switchMode(m: Mode) {
    setMode(m);
    setError("");
  }

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
      if (!res.ok) { setError(data.error || "Ошибка входа"); return; }
      localStorage.setItem("cv_token", data.token);
      localStorage.setItem("cv_user", JSON.stringify(data.user));
      navigate("/video/cabinet");
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  async function doRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== password2) { setError("Пароли не совпадают"); return; }
    if (password.length < 6) { setError("Пароль должен быть не менее 6 символов"); return; }

    setLoading(true);
    try {
      const res = await fetch(`${AUTH_URL}?action=register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка регистрации"); return; }
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
      {/* bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[120px]" style={{ background: "var(--neon-blue)" }} />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full opacity-[0.06] blur-[100px]" style={{ background: "var(--neon-purple)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/video/cloud" className="inline-flex items-center gap-3">
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

        {/* Tab switcher */}
        <div className="flex p-1 rounded-2xl mb-6"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={() => switchMode("login")}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={mode === "login"
              ? { background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))", color: "#0b0e17" }
              : { color: "rgba(255,255,255,0.35)" }}>
            Войти
          </button>
          <button onClick={() => switchMode("register")}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={mode === "register"
              ? { background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))", color: "#0b0e17" }
              : { color: "rgba(255,255,255,0.35)" }}>
            Регистрация
          </button>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>

          {mode === "login" ? (
            <>
              <h1 className="text-2xl font-black text-white mb-1">Войти в кабинет</h1>
              <p className="text-white/35 text-sm mb-7">Управляй камерами из любой точки мира</p>

              {/* Demo banner */}
              <button type="button" onClick={(e) => doLogin(e, true)} disabled={loading}
                className="w-full mb-6 p-4 rounded-2xl text-left transition-all hover:-translate-y-0.5"
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
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com" required
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none placeholder:text-white/20"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Icon name="Mail" size={16} color="rgba(255,255,255,0.25)" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Пароль</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" required
                      className="w-full pl-10 pr-10 py-3 rounded-xl text-white text-sm outline-none placeholder:text-white/20"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Icon name="Lock" size={16} color="rgba(255,255,255,0.25)" />
                    </div>
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
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

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-2xl font-black text-sm transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))", color: "#0b0e17", boxShadow: "0 0 30px rgba(0,212,255,0.2)" }}>
                  {loading ? <Icon name="Loader2" size={18} color="#0b0e17" /> : <Icon name="LogIn" size={18} color="#0b0e17" />}
                  {loading ? "Входим..." : "Войти"}
                </button>
              </form>

              <p className="text-center text-white/25 text-xs mt-5">
                Нет аккаунта?{" "}
                <button onClick={() => switchMode("register")} className="underline hover:text-white/50 transition-colors">
                  Зарегистрироваться
                </button>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black text-white mb-1">Создать аккаунт</h1>
              <p className="text-white/35 text-sm mb-7">
                14 дней бесплатно на тарифе Про — без карты
              </p>

              {/* Trial badge */}
              <div className="flex items-center gap-3 p-3 rounded-2xl mb-6"
                style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.2)" }}>
                <Icon name="Gift" size={16} color="#fbbf24" />
                <p className="text-xs" style={{ color: "rgba(251,191,36,0.9)" }}>
                  После регистрации — <b>14 дней бесплатного доступа</b> к тарифу Про: 8 камер, архив 30 дней, 4K
                </p>
              </div>

              <form onSubmit={doRegister} className="space-y-4">
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Ваше имя</label>
                  <div className="relative">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Иван Иванов" required
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none placeholder:text-white/20"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Icon name="User" size={16} color="rgba(255,255,255,0.25)" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Email</label>
                  <div className="relative">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com" required
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none placeholder:text-white/20"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Icon name="Mail" size={16} color="rgba(255,255,255,0.25)" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Пароль</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Минимум 6 символов" required
                      className="w-full pl-10 pr-10 py-3 rounded-xl text-white text-sm outline-none placeholder:text-white/20"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Icon name="Lock" size={16} color="rgba(255,255,255,0.25)" />
                    </div>
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Icon name={showPass ? "EyeOff" : "Eye"} size={16} color="rgba(255,255,255,0.25)" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Повторите пароль</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={password2} onChange={(e) => setPassword2(e.target.value)}
                      placeholder="••••••••" required
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none placeholder:text-white/20"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${password2 && password !== password2 ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)"}`,
                      }} />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Icon name="Lock" size={16} color="rgba(255,255,255,0.25)" />
                    </div>
                  </div>
                  {password2 && password !== password2 && (
                    <p className="text-red-400 text-xs mt-1">Пароли не совпадают</p>
                  )}
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <Icon name="AlertCircle" size={15} color="#ef4444" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button type="submit" disabled={loading || (!!password2 && password !== password2)}
                  className="w-full py-3.5 rounded-2xl font-black text-sm transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))", color: "#0b0e17", boxShadow: "0 0 30px rgba(0,212,255,0.2)" }}>
                  {loading ? <Icon name="Loader2" size={18} color="#0b0e17" /> : <Icon name="UserPlus" size={18} color="#0b0e17" />}
                  {loading ? "Создаём аккаунт..." : "Зарегистрироваться бесплатно"}
                </button>

                <p className="text-center text-white/20 text-xs">
                  Нажимая кнопку, вы соглашаетесь с условиями использования сервиса
                </p>
              </form>

              <p className="text-center text-white/25 text-xs mt-5">
                Уже есть аккаунт?{" "}
                <button onClick={() => switchMode("login")} className="underline hover:text-white/50 transition-colors">
                  Войти
                </button>
              </p>
            </>
          )}
        </div>

        {/* Footer */}
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
