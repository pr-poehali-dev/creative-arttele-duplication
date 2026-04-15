import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import PageBackground from "@/components/PageBackground";
import funcUrls from "../../backend/func2url.json";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login || !password) {
      setError("Введите логин и пароль");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const resp = await fetch(funcUrls["mikrobill-scraper"] + "?action=auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await resp.json();

      if (!resp.ok || !data.success) {
        setError(data.error || "Ошибка авторизации");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("lk_user", JSON.stringify(data.user));
      localStorage.setItem("lk_creds", btoa(unescape(encodeURIComponent(JSON.stringify({ login, password })))));
      navigate("/dashboard");
    } catch {
      setError("Ошибка подключения к серверу");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <PageBackground />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20 blur-[120px]"
          style={{ background: "var(--neon-blue)" }}
        />
        <div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-15 blur-[120px]"
          style={{ background: "var(--neon-green)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-[100px]"
          style={{ background: "var(--neon-purple)" }}
        />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        <Link to="/" className="flex items-center justify-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
            <img
              src="https://cdn.poehali.dev/projects/5573dd0c-764b-4bc3-951f-74ecfdbb396f/files/eab6cd5f-932d-4520-b6dc-7b7f9fa0ff47.jpg"
              alt="АртТелеком Юг"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-montserrat font-black text-2xl tracking-tight leading-none">
            <span style={{ color: "var(--neon-blue)" }}>АртТелеком</span>
            <span className="text-white"> Юг</span>
          </span>
        </Link>

        <div
          className="rounded-2xl p-8 backdrop-blur-xl"
          style={{
            background: "rgba(17, 24, 39, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 0 80px rgba(0, 212, 255, 0.06), 0 25px 50px rgba(0, 0, 0, 0.4)",
          }}
        >
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{
                background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,245,122,0.15))",
                border: "1px solid rgba(0,212,255,0.2)",
              }}
            >
              <Icon name="UserCircle" size={32} className="text-[#00d4ff]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Личный кабинет</h1>
            <p className="text-white/50 text-sm">Войдите для управления услугами</p>
          </div>

          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
              }}
            >
              <Icon name="AlertCircle" size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-white/60 mb-2 font-medium">Логин</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <Icon name="User" size={18} />
                </div>
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Введите логин"
                  autoFocus
                  maxLength={50}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-white/25 outline-none transition-all duration-200 text-sm"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(0, 212, 255, 0.4)";
                    e.target.style.boxShadow = "0 0 20px rgba(0, 212, 255, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2 font-medium">Пароль</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <Icon name="Lock" size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  maxLength={50}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-white placeholder-white/25 outline-none transition-all duration-200 text-sm"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(0, 212, 255, 0.4)";
                    e.target.style.boxShadow = "0 0 20px rgba(0, 212, 255, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 text-[#0b0e17] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
              style={{
                background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))",
                boxShadow: "0 0 30px rgba(0, 212, 255, 0.25)",
              }}
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={18} className="animate-spin" />
                  Вход...
                </>
              ) : (
                <>
                  <Icon name="LogIn" size={18} />
                  Войти
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="https://lk.arttele.ru/forgot.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/40 hover:text-[#00d4ff] transition-colors"
            >
              Забыли пароль?
            </a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}