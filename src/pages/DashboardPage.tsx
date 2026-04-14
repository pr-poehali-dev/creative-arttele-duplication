import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import PageBackground from "@/components/PageBackground";

type TabKey = "main" | "balance" | "tariff" | "stats" | "tickets" | "settings";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5573dd0c-764b-4bc3-951f-74ecfdbb396f/files/eab6cd5f-932d-4520-b6dc-7b7f9fa0ff47.jpg";

const menuItems: { key: TabKey | "logout"; label: string; icon: string }[] = [
  { key: "main", label: "Главная", icon: "Home" },
  { key: "balance", label: "Баланс и оплата", icon: "Wallet" },
  { key: "tariff", label: "Мой тариф", icon: "Wifi" },
  { key: "stats", label: "Статистика", icon: "BarChart3" },
  { key: "tickets", label: "Заявки", icon: "MessageSquare" },
  { key: "settings", label: "Настройки", icon: "Settings" },
  { key: "logout", label: "Выход", icon: "LogOut" },
];

const payments = [
  { date: "01.04.2026", amount: "+650.00 ₽", method: "Банковская карта", status: "Успешно" },
  { date: "01.03.2026", amount: "+650.00 ₽", method: "Банковская карта", status: "Успешно" },
  { date: "15.02.2026", amount: "+200.00 ₽", method: "Обещанный платёж", status: "Погашен" },
  { date: "01.02.2026", amount: "+650.00 ₽", method: "СБП", status: "Успешно" },
  { date: "01.01.2026", amount: "+650.00 ₽", method: "Банковская карта", status: "Успешно" },
];

const trafficData = [
  { date: "07.04.2026", incoming: "12.4 ГБ", outgoing: "3.1 ГБ" },
  { date: "08.04.2026", incoming: "8.7 ГБ", outgoing: "2.3 ГБ" },
  { date: "09.04.2026", incoming: "15.2 ГБ", outgoing: "4.8 ГБ" },
  { date: "10.04.2026", incoming: "6.1 ГБ", outgoing: "1.9 ГБ" },
  { date: "11.04.2026", incoming: "22.8 ГБ", outgoing: "7.2 ГБ" },
  { date: "12.04.2026", incoming: "18.3 ГБ", outgoing: "5.6 ГБ" },
  { date: "13.04.2026", incoming: "9.5 ГБ", outgoing: "2.7 ГБ" },
];

const tickets = [
  { id: "TK-20241", topic: "Низкая скорость интернета", date: "10.04.2026", status: "В работе" },
  { id: "TK-20198", topic: "Перенос точки подключения", date: "28.03.2026", status: "Решена" },
  { id: "TK-20187", topic: "Настройка роутера", date: "15.03.2026", status: "Решена" },
];

const tariffs = [
  { name: "Старт 100", speed: "100 Мбит/с", price: 390, active: false },
  { name: "Турбо 500", speed: "500 Мбит/с", price: 650, active: true },
  { name: "Максимум 1000", speed: "1 Гбит/с", price: 990, active: false },
];

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

function TabMain() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(0, 212, 255, 0.12)", border: "1px solid rgba(0, 212, 255, 0.2)" }}
            >
              <Icon name="Wallet" size={20} style={{ color: "var(--neon-blue)" }} />
            </div>
            <span className="text-white/50 text-sm">Баланс</span>
          </div>
          <p className="text-3xl font-bold text-white font-montserrat mb-3">450.00 ₽</p>
          <NeonButton variant="blue" className="w-full text-xs py-2">
            <Icon name="Plus" size={14} />
            Пополнить баланс
          </NeonButton>
        </GlassCard>

        <GlassCard className="p-5 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(0, 245, 122, 0.12)", border: "1px solid rgba(0, 245, 122, 0.2)" }}
            >
              <Icon name="Wifi" size={20} style={{ color: "var(--neon-green)" }} />
            </div>
            <span className="text-white/50 text-sm">Тариф</span>
          </div>
          <p className="text-xl font-bold text-white font-montserrat">Турбо 500</p>
          <p className="text-white/40 text-sm mt-1">500 Мбит/с / 650 ₽/мес</p>
          <NeonButton variant="outline" className="w-full text-xs py-2 mt-3">
            <Icon name="ArrowRightLeft" size={14} />
            Сменить тариф
          </NeonButton>
        </GlassCard>

        <GlassCard className="p-5 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(0, 245, 122, 0.12)", border: "1px solid rgba(0, 245, 122, 0.2)" }}
            >
              <Icon name="CheckCircle" size={20} style={{ color: "var(--neon-green)" }} />
            </div>
            <span className="text-white/50 text-sm">Статус</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f57a] animate-pulse" />
            <p className="text-lg font-bold text-white">Активен</p>
          </div>
          <p className="text-white/40 text-sm">Подключён с 15.03.2023</p>
        </GlassCard>

        <GlassCard className="p-5 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(168, 85, 247, 0.12)", border: "1px solid rgba(168, 85, 247, 0.2)" }}
            >
              <Icon name="CalendarClock" size={20} style={{ color: "var(--neon-purple)" }} />
            </div>
            <span className="text-white/50 text-sm">Следующее списание</span>
          </div>
          <p className="text-xl font-bold text-white font-montserrat">01.05.2026</p>
          <p className="text-white/40 text-sm mt-1">650 ₽</p>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-white font-montserrat mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} style={{ color: "var(--neon-blue)" }} />
          Быстрые действия
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: "CreditCard", label: "Пополнить", color: "var(--neon-blue)" },
            { icon: "Headphones", label: "Тех. поддержка", color: "var(--neon-green)" },
            { icon: "ArrowRightLeft", label: "Сменить тариф", color: "var(--neon-purple)" },
            { icon: "HandCoins", label: "Обещанный платёж", color: "#f59e0b" },
          ].map((action) => (
            <button
              key={action.label}
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

function TabBalance() {
  return (
    <div className="space-y-6 animate-fade-in">
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white/50 text-sm mb-1">Текущий баланс</p>
            <p className="text-5xl font-bold font-montserrat" style={{ color: "var(--neon-blue)" }}>
              450.00 ₽
            </p>
          </div>
          <div className="flex gap-3">
            <NeonButton variant="blue">
              <Icon name="Plus" size={16} />
              Пополнить баланс
            </NeonButton>
            <NeonButton variant="outline">
              <Icon name="HandCoins" size={16} />
              Обещанный платёж
            </NeonButton>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-white font-montserrat mb-4">Последние платежи</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <th className="text-left text-white/40 font-medium pb-3 pr-4">Дата</th>
                <th className="text-left text-white/40 font-medium pb-3 pr-4">Сумма</th>
                <th className="text-left text-white/40 font-medium pb-3 pr-4 hidden sm:table-cell">Способ</th>
                <th className="text-left text-white/40 font-medium pb-3">Статус</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr
                  key={i}
                  className="border-b last:border-b-0"
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
                  <td className="py-3 pr-4 text-white/70">{p.date}</td>
                  <td className="py-3 pr-4 font-semibold" style={{ color: "var(--neon-green)" }}>
                    {p.amount}
                  </td>
                  <td className="py-3 pr-4 text-white/50 hidden sm:table-cell">{p.method}</td>
                  <td className="py-3">
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-medium"
                      style={{
                        background: "rgba(0, 245, 122, 0.1)",
                        color: "var(--neon-green)",
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

function TabTariff() {
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
            <p className="text-xl font-bold text-white">Турбо 500</p>
            <p className="text-white/40 text-sm">500 Мбит/с / 650 ₽/мес</p>
          </div>
        </div>
      </GlassCard>

      <div>
        <h3 className="text-lg font-bold text-white font-montserrat mb-4">Доступные тарифы</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tariffs.map((t) => (
            <GlassCard
              key={t.name}
              className={`p-6 relative overflow-hidden transition-all duration-300 ${
                t.active ? "" : "card-hover"
              }`}
              style={
                t.active
                  ? {
                      background: "linear-gradient(135deg, rgba(0,212,255,0.1), rgba(0,245,122,0.06))",
                      border: "1px solid rgba(0, 212, 255, 0.35)",
                      boxShadow: "0 0 40px rgba(0, 212, 255, 0.08)",
                    }
                  : undefined
              }
            >
              {t.active && (
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
              <div className="mb-4">
                <p className="text-xl font-bold text-white font-montserrat">{t.name}</p>
                <p className="text-white/40 text-sm mt-1">{t.speed}</p>
              </div>
              <p className="text-3xl font-bold font-montserrat mb-1" style={{ color: t.active ? "var(--neon-blue)" : "white" }}>
                {t.price} ₽
              </p>
              <p className="text-white/40 text-sm mb-5">в месяц</p>
              {t.active ? (
                <div className="flex items-center gap-2 text-sm" style={{ color: "var(--neon-green)" }}>
                  <Icon name="CheckCircle" size={16} />
                  Подключён
                </div>
              ) : (
                <NeonButton variant="outline" className="w-full">
                  Подключить
                </NeonButton>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabStats() {
  const totalIn = "93.0 ГБ";
  const totalOut = "27.6 ГБ";

  return (
    <div className="space-y-6 animate-fade-in">
      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-white font-montserrat mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={20} style={{ color: "var(--neon-blue)" }} />
          Трафик за последние 7 дней
        </h3>
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
              {trafficData.map((row, i) => (
                <tr
                  key={i}
                  className="border-b last:border-b-0"
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
                  <td className="py-3 pr-4 text-white/70">{row.date}</td>
                  <td className="py-3 pr-4 font-semibold" style={{ color: "var(--neon-blue)" }}>
                    {row.incoming}
                  </td>
                  <td className="py-3 font-semibold" style={{ color: "var(--neon-green)" }}>
                    {row.outgoing}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <td className="py-3 pr-4 text-white font-bold">Итого</td>
                <td className="py-3 pr-4 font-bold" style={{ color: "var(--neon-blue)" }}>
                  {totalIn}
                </td>
                <td className="py-3 font-bold" style={{ color: "var(--neon-green)" }}>
                  {totalOut}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

function TabTickets() {
  const [showForm, setShowForm] = useState(false);
  const [ticketTopic, setTicketTopic] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");

  const statusColors: Record<string, { bg: string; text: string }> = {
    "Решена": { bg: "rgba(0, 245, 122, 0.1)", text: "var(--neon-green)" },
    "В работе": { bg: "rgba(245, 158, 11, 0.1)", text: "#f59e0b" },
    "Новая": { bg: "rgba(0, 212, 255, 0.1)", text: "var(--neon-blue)" },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-white font-montserrat">Мои заявки</h3>
        <NeonButton variant="blue" onClick={() => setShowForm(!showForm)}>
          <Icon name={showForm ? "X" : "Plus"} size={16} />
          {showForm ? "Отмена" : "Создать заявку"}
        </NeonButton>
      </div>

      {showForm && (
        <GlassCard className="p-6 animate-fade-in">
          <h4 className="text-white font-bold mb-4">Новая заявка</h4>
          <div className="space-y-4">
            <InputField
              label="Тема"
              icon="FileText"
              value={ticketTopic}
              onChange={setTicketTopic}
              placeholder="Опишите тему обращения"
            />
            <div>
              <label className="block text-sm text-white/60 mb-2 font-medium">Описание</label>
              <textarea
                value={ticketDesc}
                onChange={(e) => setTicketDesc(e.target.value)}
                placeholder="Подробно опишите проблему..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-white/25 outline-none transition-all duration-200 text-sm resize-none focus:border-[rgba(0,212,255,0.4)] focus:shadow-[0_0_20px_rgba(0,212,255,0.1)]"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              />
            </div>
            <NeonButton variant="green">
              <Icon name="Send" size={16} />
              Отправить заявку
            </NeonButton>
          </div>
        </GlassCard>
      )}

      <div className="space-y-3">
        {tickets.map((t) => {
          const sc = statusColors[t.status] || statusColors["Новая"];
          return (
            <GlassCard key={t.id} className="p-5 card-hover">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(0, 212, 255, 0.1)", border: "1px solid rgba(0, 212, 255, 0.15)" }}
                  >
                    <Icon name="MessageSquare" size={18} style={{ color: "var(--neon-blue)" }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.topic}</p>
                    <p className="text-white/40 text-xs mt-1">
                      {t.id} &middot; {t.date}
                    </p>
                  </div>
                </div>
                <span
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 w-fit"
                  style={{ background: sc.bg, color: sc.text }}
                >
                  {t.status}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

function TabSettings() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [phone, setPhone] = useState("+7 (900) 123-45-67");
  const [email, setEmail] = useState("ivanov@mail.ru");

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
          <NeonButton variant="blue">
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
          <NeonButton variant="green">
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

  const handleMenuClick = (key: TabKey | "logout") => {
    if (key === "logout") return;
    setActiveTab(key);
    setSidebarOpen(false);
  };

  const tabTitles: Record<TabKey, string> = {
    main: "Главная",
    balance: "Баланс и оплата",
    tariff: "Мой тариф",
    stats: "Статистика",
    tickets: "Заявки",
    settings: "Настройки",
  };

  return (
    <div className="min-h-screen relative" style={{ background: "var(--dark-bg)" }}>
      <PageBackground />

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
            <p className="text-white text-sm font-semibold">Иванов И.А.</p>
            <p className="text-white/40 text-xs">Договор №12345</p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,245,122,0.2))", border: "1px solid rgba(0,212,255,0.2)" }}
          >
            <Icon name="User" size={18} style={{ color: "var(--neon-blue)" }} />
          </div>
          <Link
            to="/login"
            className="hidden sm:flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors"
          >
            <Icon name="LogOut" size={16} />
            <span>Выйти</span>
          </Link>
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
                <Link
                  key={item.key}
                  to="/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 text-white/40 hover:text-white/70 hover:bg-white/[0.03] mt-4 border-t pt-5"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <Icon name={item.icon} size={20} />
                  <span>{item.label}</span>
                </Link>
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
              <p className="text-white text-sm font-semibold truncate">Иванов И.А.</p>
              <p className="text-white/40 text-xs truncate">Договор №12345</p>
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
              {activeTab === "tickets" && "Обращения в техническую поддержку"}
              {activeTab === "settings" && "Настройки учётной записи"}
            </p>
          </div>

          {activeTab === "main" && <TabMain />}
          {activeTab === "balance" && <TabBalance />}
          {activeTab === "tariff" && <TabTariff />}
          {activeTab === "stats" && <TabStats />}
          {activeTab === "tickets" && <TabTickets />}
          {activeTab === "settings" && <TabSettings />}
        </div>
      </main>
    </div>
  );
}
