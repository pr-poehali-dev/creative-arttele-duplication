import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Icon from "@/components/ui/icon";

const plans = [
  {
    id: "start",
    name: "Старт",
    price: 490,
    period: "мес",
    cameras: 2,
    storage: "7 дней",
    resolution: "1080p",
    features: [
      "2 камеры онлайн",
      "Хранение 7 дней",
      "Приложение iOS / Android",
      "Уведомления о движении",
      "Просмотр с любого устройства",
    ],
    color: "var(--neon-blue)",
    glow: "rgba(0,212,255,0.25)",
    popular: false,
  },
  {
    id: "pro",
    name: "Про",
    price: 1290,
    period: "мес",
    cameras: 8,
    storage: "30 дней",
    resolution: "4K",
    features: [
      "8 камер онлайн",
      "Хранение 30 дней",
      "4K разрешение",
      "ИИ-аналитика движения",
      "Экспорт видео",
      "Email / SMS алерты",
      "Приоритетная поддержка",
    ],
    color: "var(--neon-green)",
    glow: "rgba(0,245,122,0.25)",
    popular: true,
  },
  {
    id: "business",
    name: "Бизнес",
    price: 3900,
    period: "мес",
    cameras: 32,
    storage: "90 дней",
    resolution: "4K",
    features: [
      "32 камеры онлайн",
      "Хранение 90 дней",
      "4K + тепловизоры",
      "ИИ распознавание лиц",
      "API интеграция",
      "Выделенный менеджер",
      "SLA 99.9%",
      "Белый ярлык (white-label)",
    ],
    color: "var(--neon-purple)",
    glow: "rgba(168,85,247,0.25)",
    popular: false,
  },
];

const features = [
  {
    icon: "Cloud",
    title: "Хранение в облаке",
    desc: "Архив видео хранится на защищённых серверах. Никаких жёстких дисков на объекте — запись не уничтожить.",
    color: "var(--neon-blue)",
  },
  {
    icon: "Smartphone",
    title: "Смотри с телефона",
    desc: "Приложение для iOS и Android. Живая картинка и архив в кармане — в любой точке мира.",
    color: "var(--neon-green)",
  },
  {
    icon: "Brain",
    title: "ИИ-аналитика",
    desc: "Система сама обнаруживает движение, распознаёт людей и отправляет алерт только при реальной угрозе.",
    color: "var(--neon-purple)",
  },
  {
    icon: "Lock",
    title: "Шифрование 256-bit",
    desc: "Видеопоток зашифрован от камеры до экрана. Доступ только у авторизованных пользователей.",
    color: "var(--neon-blue)",
  },
  {
    icon: "Zap",
    title: "Подключение за 5 минут",
    desc: "Подключи любую IP-камеру или RTSP-поток. Никаких выездов мастера и сложных настроек.",
    color: "var(--neon-green)",
  },
  {
    icon: "BarChart3",
    title: "Статистика и отчёты",
    desc: "Отчёты по активности, тепловые карты, графики посещаемости. Данные для бизнес-решений.",
    color: "var(--neon-purple)",
  },
];

const cases = [
  { icon: "Store", title: "Магазины и ТЦ", desc: "Контроль кассиров, охрана, аналитика трафика" },
  { icon: "Warehouse", title: "Склады", desc: "Круглосуточный мониторинг без охранников" },
  { icon: "Building2", title: "Офисы", desc: "Безопасность переговорных, серверных, входа" },
  { icon: "Home", title: "Дома и дачи", desc: "Охрана имущества, доступ для детей и родителей" },
  { icon: "Construction", title: "Стройплощадки", desc: "Контроль хода работ и сохранности техники" },
  { icon: "Car", title: "Парковки", desc: "Распознавание номеров, фиксация инцидентов" },
];

const stats = [
  { value: "12 000+", label: "Камер подключено" },
  { value: "99.9%", label: "Аптайм платформы" },
  { value: "< 2 с", label: "Задержка потока" },
  { value: "256-bit", label: "Шифрование" },
];

const faqs = [
  { q: "Нужно ли покупать специальные камеры?", a: "Нет. Работаем с любыми IP-камерами с RTSP-потоком. Поддерживаем Hikvision, Dahua, Reolink и сотни других." },
  { q: "Что будет если пропадёт интернет?", a: "Камера продолжит запись на встроенную SD-карту (если есть). Как только интернет вернётся — запись автоматически загрузится в облако." },
  { q: "Можно ли поделиться доступом?", a: "Да. Добавляй сотрудников, родственников или охранников с разными правами: просмотр, экспорт, управление." },
  { q: "Есть ли пробный период?", a: "Да — 14 дней бесплатно на тарифе Про. Карта не нужна." },
];

export default function CloudVideoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billingAnnual, setBillingAnnual] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "var(--dark-bg)" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[700px] h-[700px] rounded-full opacity-[0.07] blur-[140px]" style={{ background: "var(--neon-blue)" }} />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.07] blur-[120px]" style={{ background: "var(--neon-purple)" }} />
          {/* Grid lines */}
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8 tracking-widest uppercase"
              style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.25)", color: "var(--neon-blue)" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--neon-blue)" }} />
              Облачное видеонаблюдение нового поколения
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
              Видите всё.{" "}
              <span style={{ background: "linear-gradient(90deg, var(--neon-blue), var(--neon-green))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Платите меньше.
              </span>
              <br />Спите спокойно.
            </h1>

            <p className="text-white/55 text-xl mb-10 leading-relaxed">
              Подключи камеры к облаку за 5 минут. Смотри онлайн с телефона, получай умные алерты и храни архив до 90 дней — без покупки серверов.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/video/cabinet"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))", color: "#0b0e17", boxShadow: "0 0 40px rgba(0,212,255,0.35)" }}>
                <Icon name="Play" size={20} />
                Попробовать бесплатно
              </Link>
              <a href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold text-lg transition-all hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "white" }}>
                <Icon name="Tag" size={18} />
                Смотреть цены
              </a>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.value} className="rounded-2xl p-5 text-center"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-3xl font-black mb-1" style={{ color: "var(--neon-blue)" }}>{s.value}</div>
                  <div className="text-white/40 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DEMO SCREEN ── */}
      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl overflow-hidden"
            style={{ background: "#08090f", border: "1px solid rgba(0,212,255,0.15)", boxShadow: "0 0 80px rgba(0,212,255,0.08)" }}>
            {/* Fake toolbar */}
            <div className="flex items-center justify-between px-5 py-3" style={{ background: "#0d0f1a", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: "#f59e0b" }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: "#22c55e" }} />
                </div>
                <span className="text-white/30 text-xs font-mono ml-3">cloud.video — Личный кабинет</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#ef4444" }} />
                <span className="text-white/40 text-xs font-mono">LIVE</span>
              </div>
            </div>
            {/* Camera grid mock */}
            <div className="grid grid-cols-2 gap-1 p-1">
              {[
                { label: "Вход — Камера 1", color: "#00d4ff", iframe: "https://vkvideo.ru/video_ext.php?oid=-104158648&id=456239679&hash=" },
                { label: "Парковка — Камера 2", color: "#00f57a", iframe: "https://vkvideo.ru/video_ext.php?oid=-105329382&id=456240514&hd=2&autoplay=1" },
                { label: "Склад — Камера 3", color: "#a855f7", placeholder: true },
                { label: "Офис — Камера 4", color: "#00d4ff", placeholder: true },
              ].map((cam, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "16/9", background: "#0a0c14" }}>
                  {cam.iframe ? (
                    <iframe src={cam.iframe} className="absolute inset-0 w-full h-full" style={{ border: "none" }} allow="autoplay; fullscreen" allowFullScreen />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "radial-gradient(ellipse at center, rgba(0,212,255,0.05) 0%, transparent 70%)" }}>
                      <div className="text-center">
                        <Icon name="Camera" size={32} color="rgba(255,255,255,0.1)" />
                        <p className="text-white/20 text-xs mt-2 font-mono">Нет сигнала</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)" }} />
                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: cam.color }} />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: cam.color }} />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: cam.color }} />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: cam.color }} />
                  <div className="absolute bottom-2 left-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#ef4444" }} />
                    <span className="text-white/70 text-xs font-mono">{cam.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-white/20 text-xs mt-4 font-mono">Демонстрационный режим</p>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--neon-green)" }}>Технологии</p>
            <h2 className="text-4xl lg:text-5xl font-black text-white">Почему выбирают нас</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl p-7 group transition-all hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `rgba(${f.color === "var(--neon-blue)" ? "0,212,255" : f.color === "var(--neon-green)" ? "0,245,122" : "168,85,247"},0.1)` }}>
                  <Icon name={f.icon} size={22} color={f.color} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AD BANNER ── */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden px-8 py-10 text-center"
            style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.12) 0%, rgba(168,85,247,0.12) 100%)", border: "1px solid rgba(0,212,255,0.2)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{ background: "rgba(255,200,0,0.15)", border: "1px solid rgba(255,200,0,0.3)", color: "#fbbf24" }}>
                <Icon name="Sparkles" size={12} color="#fbbf24" />
                АКЦИЯ — только до конца месяца
              </div>
              <h3 className="text-3xl font-black text-white mb-3">14 дней бесплатно на тарифе Про</h3>
              <p className="text-white/50 mb-6 max-w-xl mx-auto">Подключи до 8 камер, попробуй ИИ-аналитику и архив 30 дней. Без карты. Без обязательств.</p>
              <Link to="/video/cabinet"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#0b0e17", boxShadow: "0 0 30px rgba(251,191,36,0.3)" }}>
                <Icon name="Gift" size={16} />
                Активировать бесплатный период
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--neon-purple)" }}>Применение</p>
            <h2 className="text-4xl lg:text-5xl font-black text-white">Для любого объекта</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cases.map((c) => (
              <div key={c.title} className="rounded-2xl p-6 text-center group cursor-pointer transition-all hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)" }}>
                  <Icon name={c.icon} size={26} color="var(--neon-blue)" />
                </div>
                <h3 className="text-white font-bold mb-1">{c.title}</h3>
                <p className="text-white/40 text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--neon-blue)" }}>Тарифы</p>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Прозрачные цены</h2>
            <p className="text-white/40 mb-8">Без скрытых платежей. Отмена в любой момент.</p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-3 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <button onClick={() => setBillingAnnual(false)}
                className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
                style={!billingAnnual ? { background: "var(--neon-blue)", color: "#0b0e17" } : { color: "rgba(255,255,255,0.4)" }}>
                Ежемесячно
              </button>
              <button onClick={() => setBillingAnnual(true)}
                className="px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                style={billingAnnual ? { background: "var(--neon-green)", color: "#0b0e17" } : { color: "rgba(255,255,255,0.4)" }}>
                Годовой
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,245,122,0.2)", color: "var(--neon-green)" }}>−20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {plans.map((plan) => (
              <div key={plan.id}
                className="relative rounded-3xl p-8 flex flex-col transition-all hover:-translate-y-1"
                style={{
                  background: plan.popular ? `linear-gradient(160deg, rgba(0,245,122,0.07), rgba(0,212,255,0.04))` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${plan.popular ? "rgba(0,245,122,0.35)" : "rgba(255,255,255,0.07)"}`,
                  boxShadow: plan.popular ? `0 0 60px ${plan.glow}` : "none",
                }}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase"
                      style={{ background: "linear-gradient(90deg, var(--neon-green), var(--neon-blue))", color: "#0b0e17" }}>
                      Популярный
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: plan.color }}>{plan.name}</p>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-5xl font-black text-white">
                      {billingAnnual ? Math.round(plan.price * 0.8) : plan.price}
                    </span>
                    <span className="text-white/40 mb-2">₽/{plan.period}</span>
                  </div>
                  {billingAnnual && <p className="text-xs" style={{ color: "var(--neon-green)" }}>Экономия {plan.price * 0.2 * 12} ₽/год</p>}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-center">
                    <div className="text-xl font-black" style={{ color: plan.color }}>{plan.cameras}</div>
                    <div className="text-white/30 text-xs">камер</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-black text-white">{plan.storage}</div>
                    <div className="text-white/30 text-xs">архив</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-black text-white">{plan.resolution}</div>
                    <div className="text-white/30 text-xs">качество</div>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                      <Icon name="Check" size={15} color={plan.color} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link to="/video/cabinet"
                  className="w-full py-3.5 rounded-2xl font-black text-center transition-all hover:scale-[1.02] block"
                  style={plan.popular
                    ? { background: "linear-gradient(135deg, var(--neon-green), var(--neon-blue))", color: "#0b0e17", boxShadow: `0 0 30px ${plan.glow}` }
                    : { border: `1px solid ${plan.color}`, color: plan.color }}>
                  {plan.popular ? "Начать бесплатно" : "Выбрать тариф"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white">Частые вопросы</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((item, i) => (
              <div key={i} className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                <button className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-bold text-white pr-4">{item.q}</span>
                  <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={18} color="rgba(255,255,255,0.4)" />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-white/50 text-sm leading-relaxed">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-3xl p-14 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.07), rgba(168,85,247,0.07))", border: "1px solid rgba(0,212,255,0.15)" }}>
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[100px] opacity-20" style={{ background: "var(--neon-blue)" }} />
            <div className="relative">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Начни прямо сейчас</h2>
              <p className="text-white/40 mb-8 text-lg">14 дней бесплатно. Без карты. Без обязательств.</p>
              <Link to="/video/cabinet"
                className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))", color: "#0b0e17", boxShadow: "0 0 50px rgba(0,212,255,0.3)" }}>
                <Icon name="Rocket" size={22} />
                Перейти в личный кабинет
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <div className="text-center py-8 text-white/20 text-sm px-6">
        © 2026 CloudVideo. Все права защищены. &nbsp;·&nbsp;
        <Link to="/video" className="hover:text-white/40 transition-colors">Установка камер</Link>
        &nbsp;·&nbsp;
        <Link to="/video/cabinet" className="hover:text-white/40 transition-colors">Личный кабинет</Link>
      </div>
    </div>
  );
}