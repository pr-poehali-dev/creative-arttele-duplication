import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import PageBackground from "@/components/PageBackground";
import AiChatPanel from "@/components/AiChatPanel";
import { toast } from "sonner";
import funcUrls from "../../backend/func2url.json";

type TabKey = "main" | "balance" | "tariff" | "stats" | "assistant" | "settings";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5573dd0c-764b-4bc3-951f-74ecfdbb396f/files/eab6cd5f-932d-4520-b6dc-7b7f9fa0ff47.jpg";

const menuItems: { key: TabKey | "logout"; label: string; icon: string }[] = [
  { key: "main", label: "Главная", icon: "Home" },
  { key: "balance", label: "Баланс и оплата", icon: "Wallet" },
  { key: "tariff", label: "Мой тариф", icon: "Wifi" },
  { key: "stats", label: "Статистика", icon: "BarChart3" },
  { key: "assistant", label: "Чат с сотрудником", icon: "MessageCircle" },
  { key: "settings", label: "Настройки", icon: "Settings" },
  { key: "logout", label: "Выход", icon: "LogOut" },
];

interface UserData {
  login: string;
  name: string;
  balance: string;
  tariff: string;
  speed: string;
  status: string;
  account: string;
  address: string;
  phone: string;
  email: string;
  credit: string;
  ip: string;
  mac: string;
  group: string;
  work_until: string;
  price?: string;
  raw_info?: Record<string, string>;
  payments?: { date?: string; amount?: string; comment?: string }[];
  traffic?: { date?: string; incoming?: string; outgoing?: string }[];
}

function GlassCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl backdrop-blur-xl transition-all duration-300 ${className}`}
      style={{
        background: "rgba(17, 24, 39, 0.6)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function NeonButton({
  children,
  onClick,
  variant = "blue",
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "blue" | "green" | "outline";
  className?: string;
  type?: "button" | "submit";
}) {
  const styles: Record<string, React.CSSProperties> = {
    blue: {
      background: "linear-gradient(135deg, var(--neon-blue), #0099cc)",
      boxShadow: "0 0 25px rgba(0, 212, 255, 0.3)",
      color: "#0b0e17",
    },
    green: {
      background: "linear-gradient(135deg, var(--neon-green), #00c462)",
      boxShadow: "0 0 25px rgba(0, 245, 122, 0.3)",
      color: "#0b0e17",
    },
    outline: {
      background: "transparent",
      border: "1px solid rgba(0, 212, 255, 0.3)",
      color: "var(--neon-blue)",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-2 ${className}`}
      style={styles[variant]}
    >
      {children}
    </button>
  );
}

function InputField({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-white/60 mb-2 font-medium">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
          <Icon name={icon} size={18} />
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder-white/25 outline-none transition-all duration-200 text-sm focus:border-[rgba(0,212,255,0.4)] focus:shadow-[0_0_20px_rgba(0,212,255,0.1)]"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        />
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Icon name="Loader2" size={32} className="animate-spin text-[#00d4ff]" />
    </div>
  );
}

const HOME_TARIFFS: { name: string; speed: string; price: number; mbps: number }[] = [
  { name: "Лайт", speed: "30 Мбит/с", price: 500, mbps: 30 },
  { name: "Базовый", speed: "50 Мбит/с", price: 800, mbps: 50 },
  { name: "Комфорт", speed: "100 Мбит/с", price: 1000, mbps: 100 },
  { name: "Классик-шейк", speed: "150 Мбит/с", price: 1250, mbps: 150 },
  { name: "Старт", speed: "200 Мбит/с", price: 1300, mbps: 200 },
  { name: "Оптима", speed: "300 Мбит/с", price: 1500, mbps: 300 },
  { name: "Премиум", speed: "500 Мбит/с", price: 1700, mbps: 500 },
  { name: "Ультра", speed: "600 Мбит/с", price: 1900, mbps: 600 },
  { name: "Максимум", speed: "1 Гбит/с", price: 2700, mbps: 1000 },
  { name: "Гигабит+", speed: "2.5 Гбит/с", price: 5000, mbps: 2500 },
];

function findTariffPrice(tariffName?: string): number | null {
  if (!tariffName) return null;
  const lower = tariffName.toLowerCase();
  const byName = HOME_TARIFFS.find((t) => lower.includes(t.name.toLowerCase()));
  if (byName) return byName.price;
  const speedMatch = lower.match(/(\d+)\s*(мбит|гбит)/);
  if (speedMatch) {
    let mbps = parseInt(speedMatch[1], 10);
    if (speedMatch[2].startsWith("гбит")) mbps *= 1000;
    const bySpeed = HOME_TARIFFS.find((t) => t.mbps === mbps)
      || HOME_TARIFFS.reduce<{ t: typeof HOME_TARIFFS[number]; diff: number } | null>((acc, t) => {
        const diff = Math.abs(t.mbps - mbps);
        if (!acc || diff < acc.diff) return { t, diff };
        return acc;
      }, null)?.t;
    if (bySpeed && "price" in bySpeed) return bySpeed.price;
  }
  return null;
}

function parseDateSafe(raw?: string): Date | null {
  if (!raw) return null;
  const s = raw.trim();
  const m = s.match(/(\d{1,2})[./\-\s](\d{1,2})[./\-\s](\d{2,4})/);
  if (m) {
    const d = parseInt(m[1], 10);
    const mo = parseInt(m[2], 10) - 1;
    let y = parseInt(m[3], 10);
    if (y < 100) y += 2000;
    const dt = new Date(y, mo, d);
    return isNaN(dt.getTime()) ? null : dt;
  }
  const iso = new Date(s);
  return isNaN(iso.getTime()) ? null : iso;
}

function formatDateRu(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function getDaysWord(n: number): string {
  const abs = Math.abs(n);
  const mod10 = abs % 10;
  const mod100 = abs % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "дня";
  return "дней";
}

interface BalanceForecast {
  untilDate: string | null;
  daysLeft: number | null;
  monthlyFee: number | null;
  dailyFee: number | null;
  source: "real" | "calculated" | "unknown";
}

function computeBalanceForecast(user: UserData): BalanceForecast {
  const realPrice = parseFloat((user.price || "").replace(/\s/g, "").replace(",", "."));
  const monthlyFee = isFinite(realPrice) && realPrice > 0
    ? realPrice
    : findTariffPrice(user.tariff);
  const dailyFee = monthlyFee ? +(monthlyFee / 30).toFixed(2) : null;

  const realDate = parseDateSafe(user.work_until);
  if (realDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      untilDate: formatDateRu(realDate),
      daysLeft: Math.max(0, daysBetween(today, realDate)),
      monthlyFee,
      dailyFee,
      source: "real",
    };
  }

  const balanceNum = parseFloat((user.balance || "0").replace(/\s/g, "").replace(",", "."));
  if (isFinite(balanceNum) && monthlyFee && monthlyFee > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextFirst = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    if (balanceNum >= monthlyFee) {
      const daysLeft = daysBetween(today, nextFirst);
      return {
        untilDate: formatDateRu(nextFirst),
        daysLeft,
        monthlyFee,
        dailyFee,
        source: "calculated",
      };
    }
    return {
      untilDate: formatDateRu(nextFirst),
      daysLeft: 0,
      monthlyFee,
      dailyFee,
      source: "calculated",
    };
  }

  return {
    untilDate: null,
    daysLeft: null,
    monthlyFee,
    dailyFee,
    source: "unknown",
  };
}

function TabMain({ user, loading, onChangeTab }: { user: UserData; loading: boolean; onChangeTab: (tab: TabKey) => void }) {
  if (loading) return <LoadingSpinner />;

  const balance = user.balance || "0.00";
  const isBlocked = user.status?.toLowerCase().includes("блок");
  const forecast = computeBalanceForecast(user);
  const isUrgent = forecast.daysLeft !== null && forecast.daysLeft <= 5;

  const RED = "#ef4444";
  const quickActions = [
    { icon: "CreditCard", label: "Пополнить", color: isBlocked ? RED : "var(--neon-blue)", action: () => onChangeTab("balance") },
    { icon: "MessageCircle", label: "Чат с сотрудником", color: isBlocked ? RED : "var(--neon-green)", action: () => onChangeTab("assistant") },
    { icon: "ArrowRightLeft", label: "Сменить тариф", color: isBlocked ? RED : "var(--neon-purple)", action: () => onChangeTab("tariff") },
    { icon: "HandCoins", label: "Обещанный платёж", color: isBlocked ? RED : "#f59e0b", action: () => onChangeTab("balance") },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: isBlocked ? "rgba(239, 68, 68, 0.12)" : "rgba(0, 212, 255, 0.12)",
                border: isBlocked ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid rgba(0, 212, 255, 0.2)",
              }}
            >
              <Icon name="Wallet" size={20} style={{ color: isBlocked ? RED : "var(--neon-blue)" }} />
            </div>
            <span className="text-white/50 text-sm">Баланс</span>
          </div>
          <p className="text-3xl font-bold text-white font-montserrat mb-3">{balance} ₽</p>
          <NeonButton variant="blue" className="w-full text-xs py-2" onClick={() => onChangeTab("balance")}>
            <Icon name="Plus" size={14} />
            Пополнить баланс
          </NeonButton>
        </GlassCard>

        <GlassCard className="p-5 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: isBlocked ? "rgba(239, 68, 68, 0.12)" : "rgba(0, 245, 122, 0.12)",
                border: isBlocked ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid rgba(0, 245, 122, 0.2)",
              }}
            >
              <Icon name="Wifi" size={20} style={{ color: isBlocked ? RED : "var(--neon-green)" }} />
            </div>
            <span className="text-white/50 text-sm">Тариф</span>
          </div>
          <p className="text-xl font-bold text-white font-montserrat">{user.tariff || "—"}</p>
          <p className="text-white/40 text-sm mt-1">{user.speed || ""}</p>
          <NeonButton variant="outline" className="w-full text-xs py-2 mt-3" onClick={() => onChangeTab("tariff")}>
            <Icon name="ArrowRightLeft" size={14} />
            Сменить тариф
          </NeonButton>
        </GlassCard>

        <GlassCard className="p-5 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: isBlocked ? "rgba(239, 68, 68, 0.12)" : "rgba(0, 245, 122, 0.12)",
                border: isBlocked ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid rgba(0, 245, 122, 0.2)",
              }}
            >
              <Icon
                name={isBlocked ? "XCircle" : "CheckCircle"}
                size={20}
                style={{ color: isBlocked ? "#ef4444" : "var(--neon-green)" }}
              />
            </div>
            <span className="text-white/50 text-sm">Статус</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2.5 h-2.5 rounded-full ${isBlocked ? "bg-red-500" : "bg-[#00f57a] animate-pulse"}`} />
            <p className="text-lg font-bold text-white">{user.status || "—"}</p>
          </div>
          {user.ip && (
            <div className="text-white/40 text-sm">
              <span className="text-white/50">IP: </span>
              {user.ip
                .split(/#br#|[;,\n]/)
                .map((s) => s.trim())
                .filter(Boolean)
                .map((v, i, arr) => (
                  <span key={i} className="font-mono">
                    {v}
                    {i < arr.length - 1 ? ", " : ""}
                  </span>
                ))}
            </div>
          )}
          {user.mac && (
            <div className="text-white/40 text-sm mt-0.5">
              <span className="text-white/50">MAC: </span>
              {user.mac
                .split(/#br#|[;,\n]/)
                .map((s) => s.trim())
                .filter(Boolean)
                .map((v, i, arr) => (
                  <span key={i} className="font-mono">
                    {v.toUpperCase()}
                    {i < arr.length - 1 ? ", " : ""}
                  </span>
                ))}
            </div>
          )}
        </GlassCard>

        <GlassCard
          className="p-5 card-hover"
          style={
            (isUrgent || isBlocked)
              ? {
                  background: "linear-gradient(135deg, rgba(239,68,68,0.10), rgba(245,158,11,0.06))",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  boxShadow: "0 0 30px rgba(239, 68, 68, 0.06)",
                }
              : undefined
          }
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: (isUrgent || isBlocked) ? "rgba(239, 68, 68, 0.15)" : "rgba(168, 85, 247, 0.12)",
                border: (isUrgent || isBlocked) ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(168, 85, 247, 0.2)",
              }}
            >
              <Icon
                name="CalendarClock"
                size={20}
                style={{ color: (isUrgent || isBlocked) ? RED : "var(--neon-purple)" }}
              />
            </div>
            <span className="text-white/50 text-sm">Баланса хватит до</span>
          </div>
          <p
            className="text-xl font-bold font-montserrat"
            style={{ color: (isUrgent || isBlocked) ? RED : "#fff" }}
          >
            {forecast.untilDate || "—"}
          </p>
          {forecast.daysLeft !== null ? (
            <p className="text-sm mt-1" style={{ color: (isUrgent || isBlocked) ? "#fca5a5" : "rgba(255,255,255,0.5)" }}>
              Осталось ≈ {forecast.daysLeft} {getDaysWord(forecast.daysLeft)}
            </p>
          ) : user.credit ? (
            <p className="text-white/40 text-sm mt-1">Обещанный платёж: {user.credit} ₽</p>
          ) : (
            <p className="text-white/40 text-sm mt-1">{user.account ? `Договор: ${user.account}` : "—"}</p>
          )}
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-white font-montserrat mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} style={{ color: isBlocked ? RED : "var(--neon-blue)" }} />
          Быстрые действия
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.action}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 hover:scale-[1.04] active:scale-[0.96]"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: `${action.color}15`,
                  border: `1px solid ${action.color}30`,
                }}
              >
                <Icon name={action.icon} size={22} style={{ color: action.color }} />
              </div>
              <span className="text-white/70 text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-white font-montserrat mb-4 flex items-center gap-2">
          <Icon name="Megaphone" size={20} style={{ color: "#f59e0b" }} />
          Объявления
        </h3>
        <div
          className="p-4 rounded-xl flex items-start gap-3"
          style={{
            background: "rgba(245, 158, 11, 0.06)",
            border: "1px solid rgba(245, 158, 11, 0.15)",
          }}
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(245, 158, 11, 0.15)" }}>
            <Icon name="AlertTriangle" size={18} style={{ color: "#f59e0b" }} />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Плановые технические работы</p>
            <p className="text-white/50 text-sm mt-1">
              20.04.2026 с 02:00 до 06:00 будут проводиться плановые работы на сети. Возможны кратковременные перерывы в предоставлении услуг.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function TabBalance({ user, payments, loading }: { user: UserData; payments: UserData["payments"]; loading: boolean }) {
  const [showPayBanner, setShowPayBanner] = useState(false);

  if (loading) return <LoadingSpinner />;

  const balance = user.balance || "0.00";
  const payList = payments || [];
  const forecast = computeBalanceForecast(user);
  const isUrgent = forecast.daysLeft !== null && forecast.daysLeft <= 5;
  const accent = isUrgent ? "#ef4444" : "var(--neon-blue)";

  return (
    <div className="space-y-6 animate-fade-in">
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white/50 text-sm mb-1">Текущий баланс</p>
            <p className="text-5xl font-bold font-montserrat" style={{ color: "var(--neon-blue)" }}>
              {balance} ₽
            </p>
          </div>
          <div className="flex gap-3">
            <NeonButton variant="blue" onClick={() => setShowPayBanner(true)}>
              <Icon name="Plus" size={16} />
              Пополнить баланс
            </NeonButton>
            <NeonButton variant="outline" onClick={() => setShowPayBanner(true)}>
              <Icon name="HandCoins" size={16} />
              Обещанный платёж
            </NeonButton>
          </div>
        </div>
      </GlassCard>

      <div
        className="relative rounded-2xl p-6 sm:p-7 overflow-hidden"
        style={{
          background: isUrgent
            ? "linear-gradient(135deg, rgba(239,68,68,0.10), rgba(245,158,11,0.05))"
            : "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(168,85,247,0.05))",
          border: `1px solid ${isUrgent ? "rgba(239,68,68,0.25)" : "rgba(0,212,255,0.22)"}`,
          boxShadow: isUrgent ? "0 0 50px rgba(239,68,68,0.08)" : "0 0 50px rgba(0,212,255,0.06)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 blur-[80px]"
          style={{ background: isUrgent ? "#ef4444" : "var(--neon-blue)" }}
        />

        <div className="relative flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: isUrgent ? "rgba(239,68,68,0.18)" : "rgba(0,212,255,0.15)",
                border: `1px solid ${isUrgent ? "rgba(239,68,68,0.3)" : "rgba(0,212,255,0.3)"}`,
                boxShadow: `0 0 25px ${isUrgent ? "rgba(239,68,68,0.15)" : "rgba(0,212,255,0.15)"}`,
              }}
            >
              <Icon
                name={isUrgent ? "AlertTriangle" : "CalendarClock"}
                size={28}
                style={{ color: accent }}
              />
            </div>
            <div>
              <p className="text-white/50 text-sm mb-1">
                {forecast.source === "real"
                  ? "Услуга действует до"
                  : "Следующее списание"}
              </p>
              <p
                className="text-3xl sm:text-4xl font-bold font-montserrat"
                style={{ color: accent }}
              >
                {forecast.untilDate || "—"}
              </p>
              {forecast.daysLeft !== null && (
                <p className="text-white/60 text-sm mt-1.5">
                  {forecast.source === "real" ? "Осталось" : "Через"} ≈{" "}
                  <span className="font-semibold text-white">
                    {forecast.daysLeft} {getDaysWord(forecast.daysLeft)}
                  </span>
                  {forecast.source === "calculated" && (
                    <span className="text-white/35"> · списание 1-го числа</span>
                  )}
                </p>
              )}
              {forecast.source === "unknown" && (
                <p className="text-white/50 text-sm mt-1.5">
                  Недостаточно данных для расчёта
                </p>
              )}
            </div>
          </div>

          <div
            className="grid grid-cols-2 gap-4 sm:gap-6 lg:border-l lg:pl-6"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div>
              <p className="text-white/45 text-xs uppercase tracking-wider mb-1.5">Оплата по тарифу</p>
              <p className="text-xl font-bold text-white font-montserrat">
                {forecast.monthlyFee !== null ? `${forecast.monthlyFee} ₽` : "—"}
              </p>
              <p className="text-white/40 text-xs mt-0.5">в месяц</p>
            </div>
            <div>
              <p className="text-white/45 text-xs uppercase tracking-wider mb-1.5">В день</p>
              <p className="text-xl font-bold text-white font-montserrat">
                {forecast.dailyFee !== null ? `${forecast.dailyFee} ₽` : "—"}
              </p>
              <p className="text-white/40 text-xs mt-0.5">списание</p>
            </div>
          </div>
        </div>

        {isUrgent && (
          <div
            className="relative mt-5 p-3 rounded-xl flex items-start gap-2.5"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.18)",
            }}
          >
            <Icon name="Info" size={16} style={{ color: "#ef4444" }} className="shrink-0 mt-0.5" />
            <p className="text-sm text-white/70">
              Скоро потребуется пополнение. Пополните баланс, чтобы избежать отключения услуги.
            </p>
          </div>
        )}
      </div>

      {showPayBanner && (
        <div
          className="relative rounded-2xl p-6 sm:p-8 overflow-hidden animate-fade-in"
          style={{
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(245, 158, 11, 0.06))",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            boxShadow: "0 0 60px rgba(239, 68, 68, 0.06)",
          }}
        >
          <button
            onClick={() => setShowPayBanner(false)}
            className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors"
          >
            <Icon name="X" size={20} />
          </button>

          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-[80px]" style={{ background: "#ef4444" }} />

          <div className="relative flex flex-col sm:flex-row items-start gap-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(245, 158, 11, 0.15))",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                boxShadow: "0 0 30px rgba(239, 68, 68, 0.1)",
              }}
            >
              <Icon name="ShieldAlert" size={28} style={{ color: "#ef4444" }} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white font-montserrat mb-2">
                Онлайн-оплата временно недоступна
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                В связи с блокировками платёжных систем онлайн-платежи временно не проходят.
                Для пополнения баланса свяжитесь с нами — мы поможем выбрать удобный способ оплаты.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/contacts"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))",
                    color: "#0b0e17",
                    boxShadow: "0 0 25px rgba(0, 212, 255, 0.25)",
                  }}
                >
                  <Icon name="Phone" size={16} />
                  Связаться с нами
                </a>
                <a
                  href="tel:+79024048850"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(0, 212, 255, 0.3)",
                    color: "var(--neon-blue)",
                  }}
                >
                  <Icon name="PhoneCall" size={16} />
                  +7 (902) 404-88-50
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-white font-montserrat mb-4">Последние платежи</h3>
        {payList.length === 0 ? (
          <p className="text-white/40 text-sm">Нет данных о платежах</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <th className="text-left text-white/40 font-medium pb-3 pr-4">Дата</th>
                  <th className="text-left text-white/40 font-medium pb-3 pr-4">Сумма</th>
                  <th className="text-left text-white/40 font-medium pb-3 hidden sm:table-cell">Комментарий</th>
                </tr>
              </thead>
              <tbody>
                {payList.map((p, i) => (
                  <tr
                    key={i}
                    className="border-b last:border-b-0"
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  >
                    <td className="py-3 pr-4 text-white/70">{p.date || "—"}</td>
                    <td className="py-3 pr-4 font-semibold" style={{ color: "var(--neon-green)" }}>
                      {p.amount ? `${p.amount} ₽` : "—"}
                    </td>
                    <td className="py-3 text-white/50 hidden sm:table-cell">{p.comment || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function TabTariff({ user, loading }: { user: UserData; loading: boolean }) {
  if (loading) return <LoadingSpinner />;

  const tariffs: { name: string; speed: string; price: number; popular?: boolean }[] = [
    { name: "Лайт", speed: "30 Мбит/с", price: 500 },
    { name: "Базовый", speed: "50 Мбит/с", price: 800 },
    { name: "Комфорт", speed: "100 Мбит/с", price: 1000 },
    { name: "Старт", speed: "200 Мбит/с", price: 1300 },
    { name: "Оптима", speed: "300 Мбит/с", price: 1500, popular: true },
    { name: "Премиум", speed: "500 Мбит/с", price: 1700 },
    { name: "Ультра", speed: "600 Мбит/с", price: 1900 },
    { name: "Максимум", speed: "1 Гбит/с", price: 2700 },
    { name: "Гигабит+", speed: "2.5 Гбит/с", price: 5000 },
  ];

  const forecast = computeBalanceForecast(user);
  const isUrgent = forecast.daysLeft !== null && forecast.daysLeft <= 5;

  return (
    <div className="space-y-6 animate-fade-in">
      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-white font-montserrat mb-1">Текущий тариф</h3>
        <div className="flex items-center gap-3 mt-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(0, 245, 122, 0.12)", border: "1px solid rgba(0, 245, 122, 0.2)" }}
          >
            <Icon name="Wifi" size={24} style={{ color: "var(--neon-green)" }} />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{user.tariff || "—"}</p>
            <p className="text-white/40 text-sm">{user.speed || ""}</p>
          </div>
        </div>
        {user.group && (
          <p className="text-white/40 text-sm mt-3">Сетевая группа: {user.group}</p>
        )}
      </GlassCard>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Wallet" size={16} style={{ color: "var(--neon-blue)" }} />
            <span className="text-white/50 text-xs uppercase tracking-wider">Оплата по тарифу</span>
          </div>
          <p className="text-2xl font-bold text-white font-montserrat">
            {forecast.monthlyFee !== null ? `${forecast.monthlyFee} ₽` : "—"}
          </p>
          <p className="text-white/40 text-xs mt-1">в месяц</p>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Timer" size={16} style={{ color: "var(--neon-green)" }} />
            <span className="text-white/50 text-xs uppercase tracking-wider">Списание в день</span>
          </div>
          <p className="text-2xl font-bold text-white font-montserrat">
            {forecast.dailyFee !== null ? `${forecast.dailyFee} ₽` : "—"}
          </p>
          <p className="text-white/40 text-xs mt-1">≈ {forecast.monthlyFee ? "месяц / 30" : "нет данных"}</p>
        </GlassCard>
        <GlassCard
          className="p-5"
          style={
            isUrgent
              ? {
                  background: "linear-gradient(135deg, rgba(239,68,68,0.10), rgba(245,158,11,0.05))",
                  border: "1px solid rgba(239,68,68,0.25)",
                }
              : undefined
          }
        >
          <div className="flex items-center gap-2 mb-2">
            <Icon
              name="CalendarClock"
              size={16}
              style={{ color: isUrgent ? "#ef4444" : "var(--neon-purple)" }}
            />
            <span className="text-white/50 text-xs uppercase tracking-wider">Баланса хватит до</span>
          </div>
          <p
            className="text-2xl font-bold font-montserrat"
            style={{ color: isUrgent ? "#ef4444" : "#fff" }}
          >
            {forecast.untilDate || "—"}
          </p>
          <p className="text-white/40 text-xs mt-1">
            {forecast.daysLeft !== null
              ? `≈ ${forecast.daysLeft} ${getDaysWord(forecast.daysLeft)}`
              : "нет данных"}
          </p>
        </GlassCard>
      </div>

      {user.address && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-white font-montserrat mb-3">Адрес подключения</h3>
          <p className="text-white/70">{user.address}</p>
        </GlassCard>
      )}

      <div>
        <h3 className="text-lg font-bold text-white font-montserrat mb-4">Доступные тарифы</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tariffs.map((t) => {
            const isActive = user.tariff?.toLowerCase().includes(t.name.toLowerCase());
            return (
              <GlassCard
                key={t.name}
                className={`p-6 relative overflow-hidden transition-all duration-300 ${isActive ? "" : "card-hover"}`}
                style={
                  isActive
                    ? {
                        background: "linear-gradient(135deg, rgba(0,212,255,0.1), rgba(0,245,122,0.06))",
                        border: "1px solid rgba(0, 212, 255, 0.35)",
                        boxShadow: "0 0 40px rgba(0, 212, 255, 0.08)",
                      }
                    : undefined
                }
              >
                {isActive && (
                  <div
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={{
                      background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))",
                      color: "#0b0e17",
                    }}
                  >
                    Текущий
                  </div>
                )}
                {!isActive && t.popular && (
                  <div
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={{
                      background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                      color: "#fff",
                    }}
                  >
                    Популярный
                  </div>
                )}
                <div className="mb-4">
                  <p className="text-xl font-bold text-white font-montserrat">{t.name}</p>
                  <p className="text-white/40 text-sm mt-1">{t.speed}</p>
                </div>
                <p className="text-3xl font-bold font-montserrat mb-1" style={{ color: isActive ? "var(--neon-blue)" : "white" }}>
                  {t.price} ₽
                </p>
                <p className="text-white/40 text-sm mb-5">в месяц</p>
                {isActive ? (
                  <div className="flex items-center gap-2 text-sm" style={{ color: "var(--neon-green)" }}>
                    <Icon name="CheckCircle" size={16} />
                    Подключён
                  </div>
                ) : (
                  <NeonButton variant="outline" className="w-full" onClick={() => toast.info("Для смены тарифа позвоните: +7 (902) 404-88-50")}>
                    Подключить
                  </NeonButton>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TabStats({ traffic, loading }: { traffic: UserData["traffic"]; loading: boolean }) {
  if (loading) return <LoadingSpinner />;

  const trafficList = traffic || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-white font-montserrat mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={20} style={{ color: "var(--neon-blue)" }} />
          Статистика трафика
        </h3>
        {trafficList.length === 0 ? (
          <p className="text-white/40 text-sm">Нет данных о трафике</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <th className="text-left text-white/40 font-medium pb-3 pr-4">Дата</th>
                  <th className="text-left text-white/40 font-medium pb-3 pr-4">Входящий</th>
                  <th className="text-left text-white/40 font-medium pb-3">Исходящий</th>
                </tr>
              </thead>
              <tbody>
                {trafficList.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b last:border-b-0"
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  >
                    <td className="py-3 pr-4 text-white/70">{row.date || "—"}</td>
                    <td className="py-3 pr-4 font-semibold" style={{ color: "var(--neon-blue)" }}>
                      {row.incoming || "—"}
                    </td>
                    <td className="py-3 font-semibold" style={{ color: "var(--neon-green)" }}>
                      {row.outgoing || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function TabSettings({ user }: { user: UserData }) {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [phone, setPhone] = useState(user.phone || "");
  const [email, setEmail] = useState(user.email || "");

  const handleChangePassword = () => {
    toast.info("Для изменения пароля обратитесь в поддержку: +7 (902) 404-88-50");
  };

  const handleSaveContacts = () => {
    toast.info("Для изменения контактных данных обратитесь в поддержку: +7 (902) 404-88-50");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-white font-montserrat mb-5 flex items-center gap-2">
          <Icon name="Lock" size={20} style={{ color: "var(--neon-blue)" }} />
          Смена пароля
        </h3>
        <div className="space-y-4 max-w-md">
          <InputField
            label="Текущий пароль"
            icon="Lock"
            type="password"
            value={oldPass}
            onChange={setOldPass}
            placeholder="Введите текущий пароль"
          />
          <InputField
            label="Новый пароль"
            icon="KeyRound"
            type="password"
            value={newPass}
            onChange={setNewPass}
            placeholder="Введите новый пароль"
          />
          <InputField
            label="Подтверждение пароля"
            icon="KeyRound"
            type="password"
            value={confirmPass}
            onChange={setConfirmPass}
            placeholder="Повторите новый пароль"
          />
          <NeonButton variant="blue" onClick={handleChangePassword}>
            <Icon name="Save" size={16} />
            Сменить пароль
          </NeonButton>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-white font-montserrat mb-5 flex items-center gap-2">
          <Icon name="UserCog" size={20} style={{ color: "var(--neon-green)" }} />
          Контактные данные
        </h3>
        <div className="space-y-4 max-w-md">
          <InputField
            label="Телефон"
            icon="Phone"
            value={phone}
            onChange={setPhone}
            placeholder="+7 (___) ___-__-__"
          />
          <InputField
            label="Email"
            icon="Mail"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="your@email.com"
          />
          <NeonButton variant="green" onClick={handleSaveContacts}>
            <Icon name="Save" size={16} />
            Сохранить
          </NeonButton>
        </div>
      </GlassCard>
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("main");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const credsStr = localStorage.getItem("lk_creds");
    if (!credsStr) {
      navigate("/login");
      return;
    }

    let creds: { login: string; password: string };
    try {
      creds = JSON.parse(decodeURIComponent(escape(atob(credsStr))));
    } catch {
      navigate("/login");
      return;
    }

    const url = funcUrls["mikrobill-scraper"];
    let cancelled = false;

    const fetchUserData = (initial: boolean) => {
      fetch(`${url}?action=user_info&login=${encodeURIComponent(creds.login)}&password=${encodeURIComponent(creds.password)}`)
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          setUserData(data);
          try {
            localStorage.setItem("lk_user", JSON.stringify(data));
          } catch {
            /* ignore */
          }
          if (initial) setLoading(false);
        })
        .catch(() => {
          if (initial && !cancelled) setLoading(false);
        });
    };

    fetchUserData(true);

    const intervalId = window.setInterval(() => fetchUserData(false), 60_000);
    const onFocus = () => fetchUserData(false);
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchUserData(false);
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [navigate]);

  const user: UserData = userData || JSON.parse(localStorage.getItem("lk_user") || '{"login":"","name":"","balance":"","tariff":"","speed":"","status":"","account":"","address":"","phone":"","email":"","credit":"","ip":"","mac":"","group":"","work_until":""}');

  const handleLogout = () => {
    localStorage.removeItem("lk_user");
    localStorage.removeItem("lk_creds");
    navigate("/login");
  };

  const handleMenuClick = (key: TabKey | "logout") => {
    if (key === "logout") {
      handleLogout();
      return;
    }
    setActiveTab(key);
    setSidebarOpen(false);
  };

  const handleChangeTab = (tab: TabKey) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tabTitles: Record<TabKey, string> = {
    main: "Главная",
    balance: "Баланс и оплата",
    tariff: "Мой тариф",
    stats: "Статистика",
    assistant: "Чат с сотрудником",
    settings: "Настройки",
  };

  return (
    <div className="min-h-screen relative" style={{ background: "var(--dark-bg)" }}>
      <PageBackground />

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[700px] h-[700px] rounded-full blur-[180px]"
          style={{
            background: "var(--neon-blue)",
            top: "10%",
            left: "-10%",
            opacity: 0.15,
            animation: "dashPulse1 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[160px]"
          style={{
            background: "var(--neon-green)",
            bottom: "0%",
            right: "-10%",
            opacity: 0.12,
            animation: "dashPulse2 10s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[140px]"
          style={{
            background: "var(--neon-purple)",
            top: "50%",
            left: "40%",
            transform: "translate(-50%, -50%)",
            opacity: 0.08,
            animation: "dashPulse3 12s ease-in-out infinite",
          }}
        />
      </div>

      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-6 backdrop-blur-xl"
        style={{
          background: "rgba(11, 14, 23, 0.85)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: "rgba(255,255,255,0.05)" }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Icon name={sidebarOpen ? "X" : "Menu"} size={20} className="text-white" />
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
              <img src={LOGO_URL} alt="АртТелеком Юг" className="w-full h-full object-cover" />
            </div>
            <span className="font-montserrat font-black text-lg tracking-tight leading-none hidden sm:block">
              <span style={{ color: "var(--neon-blue)" }}>АртТелеком</span>
              <span className="text-white"> Юг</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-white text-sm font-semibold">{user.name || "Абонент"}</p>
            <p className="text-white/40 text-xs">{user.account ? `Договор №${user.account}` : user.login}</p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,245,122,0.2))", border: "1px solid rgba(0,212,255,0.2)" }}
          >
            <Icon name="User" size={18} style={{ color: "var(--neon-blue)" }} />
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors"
          >
            <Icon name="LogOut" size={16} />
            <span>Выйти</span>
          </button>
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 z-40 w-64 flex flex-col transition-transform duration-300 backdrop-blur-xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          background: "rgba(11, 14, 23, 0.9)",
          borderRight: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.key === "logout") {
              return (
                <button
                  key={item.key}
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 text-white/40 hover:text-white/70 hover:bg-white/[0.03] mt-4 border-t pt-5"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <Icon name={item.icon} size={20} />
                  <span>{item.label}</span>
                </button>
              );
            }

            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleMenuClick(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? "font-semibold"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]"
                }`}
                style={
                  isActive
                    ? {
                        background: "rgba(0, 212, 255, 0.1)",
                        color: "var(--neon-blue)",
                        border: "1px solid rgba(0, 212, 255, 0.15)",
                        boxShadow: "0 0 20px rgba(0, 212, 255, 0.05)",
                      }
                    : undefined
                }
              >
                <Icon
                  name={item.icon}
                  size={20}
                  style={isActive ? { color: "var(--neon-blue)" } : undefined}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3 sm:hidden">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,245,122,0.2))" }}
            >
              <Icon name="User" size={16} style={{ color: "var(--neon-blue)" }} />
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user.name || "Абонент"}</p>
              <p className="text-white/40 text-xs truncate">{user.account ? `Договор №${user.account}` : user.login}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-white/30 text-xs">
            <Icon name="Shield" size={14} />
            <span>Личный кабинет v2.0</span>
          </div>
        </div>
      </aside>

      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white font-montserrat">
              {tabTitles[activeTab]}
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {activeTab === "main" && "Обзор вашего подключения"}
              {activeTab === "balance" && "Управление балансом и история платежей"}
              {activeTab === "tariff" && "Управление тарифным планом"}
              {activeTab === "stats" && "Статистика использования интернета"}
              {activeTab === "assistant" && "Задайте вопрос или оформите заявку на ремонт — сотрудник примет её в работу"}
              {activeTab === "settings" && "Настройки учётной записи"}
            </p>
          </div>

          {activeTab === "main" && <TabMain user={user} loading={loading} onChangeTab={handleChangeTab} />}
          {activeTab === "balance" && <TabBalance user={user} payments={userData?.payments} loading={loading} />}
          {activeTab === "tariff" && <TabTariff user={user} loading={loading} />}
          {activeTab === "stats" && <TabStats traffic={userData?.traffic} loading={loading} />}
          {activeTab === "assistant" && (
            <div
              className="rounded-2xl overflow-hidden animate-fade-in"
              style={{
                background: "rgba(17, 24, 39, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                height: "calc(100vh - 220px)",
                minHeight: "480px",
              }}
            >
              <AiChatPanel
                mode="dashboard"
                context={{
                  name: user.name,
                  login: user.login,
                  phone: user.phone,
                  tariff: user.tariff,
                  speed: user.speed,
                  balance: user.balance,
                  status: user.status,
                  address: user.address,
                  work_until: user.work_until,
                }}
                greeting={`Здравствуйте, ${user.name || "абонент"}! На связи сотрудник АртТелеком Юг. Вижу ваш тариф «${user.tariff || "—"}», баланс ${user.balance || "—"} ₽. Задайте вопрос или нажмите «Оформить заявку», если нужен ремонт или другая помощь.`}
                placeholder="Задайте вопрос сотруднику..."
                accentColor="var(--neon-green)"
                showTicketButton
              />
            </div>
          )}
          {activeTab === "settings" && <TabSettings user={user} />}
        </div>
      </main>
    </div>
  );
}