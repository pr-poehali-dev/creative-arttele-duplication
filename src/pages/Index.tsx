import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import tariffs from "@/data/tariffs";
import Navbar from "@/components/Navbar";
import locations from "@/data/locations";

const HERO_IMG = "https://cdn.poehali.dev/projects/5573dd0c-764b-4bc3-951f-74ecfdbb396f/files/9344e7ca-fcbc-4475-8001-83fa179e1412.jpg";
const CITY_IMG = "https://cdn.poehali.dev/projects/5573dd0c-764b-4bc3-951f-74ecfdbb396f/files/8c65a182-986a-4921-8613-7a88e4c04b6f.jpg";
const WORK_IMG = "https://cdn.poehali.dev/projects/5573dd0c-764b-4bc3-951f-74ecfdbb396f/files/16177b32-dfe0-4dd3-bfd5-a6620431a2a3.jpg";

const navLinks = [
  { label: "Услуги", href: "#services" },
  { label: "Тарифы", href: "#tariffs" },
  { label: "Покрытие", href: "#coverage" },
];

const services = [
  { icon: "Zap", title: "Домашний интернет", desc: "Оптоволокно прямо в квартиру. Скорость до 1 Гбит/с без скачков и обрывов — смотрите, играйте, работайте.", tag: "До 1 Гбит/с", color: "blue" },
  { icon: "Building2", title: "Бизнес-интернет", desc: "Выделенный канал с гарантированной скоростью и SLA 99.9%. Персональный менеджер и приоритетная поддержка.", tag: "SLA 99.9%", color: "green" },
  { icon: "Tv", title: "Цифровое ТВ", desc: "450+ каналов в HD и 4K качестве. Запись эфира, пауза и перемотка прямого эфира на любом устройстве.", tag: "450+ каналов", color: "purple" },
  { icon: "Phone", title: "IP-телефония", desc: "Городской номер, бесплатные звонки внутри сети, конференц-связь и детализация в личном кабинете.", tag: "Безлимит внутри", color: "blue" },
  { icon: "Shield", title: "Антивирус и защита", desc: "Защита от вирусов, фишинга и нежелательной рекламы на уровне сети. Работает на всех устройствах.", tag: "Всегда включён", color: "green" },
  { icon: "Wifi", title: "Wi-Fi роутер", desc: "Современный роутер Wi-Fi 6 в аренду или подарок при подключении к тарифу Максимум.", tag: "Wi-Fi 6", color: "purple" },
];



const stats = [
  { num: "14", suffix: "лет", label: "на рынке" },
  { num: "280", suffix: "К+", label: "клиентов" },
  { num: "99.9", suffix: "%", label: "uptime" },
  { num: "42", suffix: "", label: "города" },
];

const faqItems = [
  { q: "Как быстро подключат интернет?", a: "Монтажник приезжает в течение 1–2 рабочих дней после заявки. Подключение занимает около 2 часов." },
  { q: "Можно ли подключить юридическое лицо?", a: "Да, мы работаем с юридическими лицами и ИП. Предлагаем специальные бизнес-тарифы с SLA и персональным менеджером." },
  { q: "Что входит в техподдержку 24/7?", a: "Звонки, чат и удалённая диагностика оборудования в любое время. Выезд мастера в рабочие часы." },
  { q: "Как сменить тариф?", a: "Через личный кабинет в 2 клика. Смена тарифа происходит моментально, без звонков и ожидания." },
  { q: "Есть ли контракт на определённый срок?", a: "Нет, мы работаем без обязательного срока контракта. Вы можете отключиться в любой момент." },
  { q: "Как оплатить услуги?", a: "Банковская карта, СБП, интернет-банкинг, автоплатёж — выбирайте удобный способ в личном кабинете." },
];

const blogPosts = [
  { title: "Wi-Fi 6E vs Wi-Fi 7: что выбрать в 2026 году", date: "5 апреля 2026", tag: "Технологии", img: HERO_IMG, desc: "Сравниваем новые стандарты беспроводной связи и объясняем, кому действительно нужен Wi-Fi 7." },
  { title: "Как повысить скорость Wi-Fi дома: 10 советов", date: "28 марта 2026", tag: "Советы", img: WORK_IMG, desc: "Расположение роутера, каналы, DNS — разбираем каждый пункт с практическими примерами." },
  { title: "Умный дом на базе нашей сети: реальные кейсы", date: "15 марта 2026", tag: "Кейсы", img: CITY_IMG, desc: "Три истории клиентов, которые построили автоматизацию дома благодаря стабильному гигабитному интернету." },
];

const coverageCities = [
  { name: "Москва", top: "28%", left: "36%" },
  { name: "СПб", top: "16%", left: "32%" },
  { name: "Казань", top: "30%", left: "50%" },
  { name: "Екатеринбург", top: "26%", left: "61%" },
  { name: "Новосиб.", top: "28%", left: "72%" },
  { name: "Краснодар", top: "42%", left: "40%" },
  { name: "Нижний", top: "28%", left: "46%" },
  { name: "Самара", top: "34%", left: "51%" },
  { name: "Уфа", top: "30%", left: "57%" },
  { name: "Воронеж", top: "36%", left: "41%" },
  { name: "Ростов", top: "44%", left: "43%" },
  { name: "Омск", top: "25%", left: "67%" },
];

export default function Index() {
  const [activeTariffTab, setActiveTariffTab] = useState<"home" | "business">("home");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [lkTab, setLkTab] = useState<"dashboard" | "bills" | "support">("dashboard");
  const [lkOpen, setLkOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ login: "", pass: "" });

  const navigate = useNavigate();

  const scrollTo = (href: string) => {
    const el = document.getElementById(href.replace("#", ""));
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen mesh-bg noise font-sans text-white">

      <Navbar onLkOpen={() => setLkOpen(true)} />

      {/* ─── HERO ─── */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0b0e17, rgba(11,14,23,0.8), transparent)" }} />
          <div className="absolute inset-0 grid-lines opacity-50" />
        </div>
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "rgba(0,212,255,0.05)", filter: "blur(120px)" }} />
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: "rgba(0,245,122,0.05)", filter: "blur(100px)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="slide-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-6 tracking-wider uppercase" style={{ borderColor: "rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.05)", color: "var(--neon-blue)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)] animate-pulse" />
              Сеть работает в 42 городах России
            </div>
            <h1 className="slide-up-delay-1 font-montserrat font-black text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6">
              Интернет<br />
              <span className="gradient-text-blue">нового</span><br />
              поколения
            </h1>
            <p className="slide-up-delay-2 text-lg text-white/60 mb-8 max-w-lg leading-relaxed">
              Гигабитное подключение по технологии TurboPon, ТВ 450+ каналов и защита от угроз — всё в одном пакете. Подключайтесь за 24 часа.
            </p>
            <div className="slide-up-delay-3 flex flex-col sm:flex-row gap-3 mb-10">
              <button onClick={() => scrollTo("#tariffs")} className="px-6 py-3.5 rounded-xl text-[#0b0e17] font-bold text-base neon-glow-btn" style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}>
                Выбрать тариф →
              </button>
              <button onClick={() => scrollTo("#coverage")} className="px-6 py-3.5 rounded-xl border border-white/15 text-white font-semibold text-base hover:border-[rgba(0,212,255,0.4)] hover:bg-[rgba(0,212,255,0.05)] transition-all">
                Проверить покрытие
              </button>
            </div>
            <div className="slide-up-delay-4 flex gap-8 flex-wrap">
              {[{ val: "2.5 Гбит/с", label: "макс. скорость" }, { val: "24 ч", label: "подключение" }, { val: "0 ₽", label: "подключение" }].map((s, i) => (
                <div key={i}>
                  <div className="font-montserrat font-black text-2xl gradient-text-blue">{s.val}</div>
                  <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="float-anim relative">
              <div className="w-72 h-72 rounded-full flex items-center justify-center relative animated-border" style={{ border: "1px solid rgba(0,212,255,0.2)" }}>
                {/* Smoke particles */}
                {Array.from({ length: 18 }, (_, i) => (
                  <div key={i} className={`smoke-particle smoke-${i + 1}`} />
                ))}

                <div className="w-52 h-52 rounded-full flex items-center justify-center" style={{ border: "1px solid rgba(0,245,122,0.2)" }}>
                  <div className="w-36 h-36 rounded-full glass-card neon-border-blue flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,245,122,0.1))" }}>
                    <span className="font-montserrat font-black text-5xl gradient-text-blue">2.5G</span>
                    <span className="text-white/50 text-xs mt-1">Гбит/с</span>
                  </div>
                </div>
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <div key={i} className="absolute w-2 h-2 rounded-full" style={{ top: "50%", left: "50%", transform: `rotate(${deg}deg) translateX(132px) translateY(-50%)`, background: "var(--neon-blue)", opacity: 0.4 + i * 0.1 }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-xs tracking-widest uppercase">Листай</span>
          <Icon name="ChevronDown" size={16} className="animate-bounce" />
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-12 relative">
        <div className="section-divider" />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="stat-number gradient-text-blue">{s.num}<span className="gradient-text-green">{s.suffix}</span></div>
                <div className="text-white/40 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="section-divider" />
      </section>

      {/* ─── LOCATIONS WIDGET ─── */}
      <section className="py-16 relative">
        <div className="absolute inset-0 grid-lines opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-3 tracking-wider uppercase" style={{ borderColor: "rgba(0,245,122,0.3)", background: "rgba(0,245,122,0.05)", color: "var(--neon-green)" }}>
                <Icon name="MapPin" size={12} /> Ваш район
              </div>
              <h2 className="font-montserrat font-black text-3xl md:text-4xl">
                Тарифы и акции<br /><span className="gradient-text-green">для вашего посёлка</span>
              </h2>
            </div>
            <Link to="/locations" className="flex items-center gap-2 text-sm font-semibold shrink-0 hover:gap-3 transition-all" style={{ color: "var(--neon-blue)" }}>
              Все населённые пункты <Icon name="ArrowRight" size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {locations.map(loc => (
              <button
                key={loc.slug}
                onClick={() => navigate(`/location/${loc.slug}`)}
                className="group glass-card rounded-2xl p-4 border border-white/5 text-left flex flex-col gap-2 transition-all duration-200 hover:scale-[1.03]"
                style={{ cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)")}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(0,212,255,0.08)", color: "var(--neon-blue)" }}>
                    <Icon name="MapPin" size={14} />
                  </div>
                  {loc.promos.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(0,245,122,0.15)", color: "var(--neon-green)" }}>
                      акция
                    </span>
                  )}
                </div>
                <div className="font-semibold text-white text-sm leading-tight group-hover:text-[#00d4ff] transition-colors">
                  {loc.name}
                </div>
                <div className="text-white/30 text-xs">
                  {loc.tariffs.length} тарифа
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4 tracking-wider uppercase" style={{ borderColor: "rgba(0,245,122,0.3)", background: "rgba(0,245,122,0.05)", color: "var(--neon-green)" }}>
              <Icon name="Layers" size={12} /> Наши услуги
            </div>
            <h2 className="font-montserrat font-black text-4xl md:text-5xl mb-4">
              Всё что нужно —<br /><span className="gradient-text-full">в одном месте</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">Интернет, ТВ, телефония и защита — управляй всем из одного личного кабинета</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc, i) => {
              const clr = svc.color === "blue" ? "rgba(0,212,255,0.3)" : svc.color === "green" ? "rgba(0,245,122,0.3)" : "rgba(168,85,247,0.3)";
              const bg = svc.color === "blue" ? "rgba(0,212,255,0.08)" : svc.color === "green" ? "rgba(0,245,122,0.08)" : "rgba(168,85,247,0.08)";
              const textClr = svc.color === "blue" ? "var(--neon-blue)" : svc.color === "green" ? "var(--neon-green)" : "rgb(192,132,252)";
              return (
                <div key={i} className="glass-card rounded-2xl p-6 card-hover cursor-pointer group border border-white/5" style={{ transition: "border-color 0.3s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = clr)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)")}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: bg, color: textClr }}>
                    <Icon name={svc.icon} size={22} />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-white">{svc.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium ml-2 shrink-0" style={{ background: bg, color: textClr }}>{svc.tag}</span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">{svc.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-white/30 group-hover:text-[#00d4ff] transition-colors">
                    Подробнее <Icon name="ArrowRight" size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TARIFFS ─── */}
      <section id="tariffs" className="py-20 relative">
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4 tracking-wider uppercase" style={{ borderColor: "rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.05)", color: "var(--neon-blue)" }}>
              <Icon name="Tag" size={12} /> Тарифы
            </div>
            <h2 className="font-montserrat font-black text-4xl md:text-5xl mb-4">
              Честные цены,<br /><span className="gradient-text-blue">без скрытых платежей</span>
            </h2>
            <div className="inline-flex mt-6 p-1 rounded-xl bg-white/5 border border-white/10">
              {(["home", "business"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTariffTab(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTariffTab === tab ? "tab-active" : "text-white/50 hover:text-white"}`}>
                  {tab === "home" ? "Для дома" : "Для бизнеса"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {tariffs.map((t, i) => {
              const clr = t.color === "blue" ? "var(--neon-blue)" : t.color === "green" ? "var(--neon-green)" : "rgb(192,132,252)";
              return (
                <div key={i} className={`rounded-2xl p-6 relative ${t.popular ? "price-popular" : "glass-card border border-white/5"}`}>
                  {t.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[#0b0e17] text-xs font-black tracking-wider" style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}>
                      ПОПУЛЯРНЫЙ
                    </div>
                  )}
                  <div className="mb-4">
                    <div className="text-white/50 text-sm mb-1">{t.name}</div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-montserrat font-black text-5xl text-white">{t.price}</span>
                      <span className="text-white/40 text-lg">₽/мес</span>
                    </div>
                    <div className="text-2xl font-montserrat font-bold mt-1" style={{ color: clr }}>
                      {parseInt(t.speed) >= 1000 ? "1 Гбит/с" : `${t.speed} Мбит/с`}
                    </div>
                  </div>
                  <div className="section-divider mb-4" />
                  <ul className="space-y-2.5 mb-6">
                    {t.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2.5 text-sm text-white/70">
                        <Icon name="Check" size={14} style={{ color: clr }} /> {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${t.popular ? "text-[#0b0e17] neon-glow-btn" : "border border-white/15 text-white hover:border-[rgba(0,212,255,0.4)] hover:bg-[rgba(0,212,255,0.05)]"}`}
                    style={t.popular ? { background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" } : {}}>
                    Подключить
                  </button>
                </div>
              );
            })}
          </div>
          <p className="text-center text-white/30 text-xs mt-8">Все тарифы включают безлимитный трафик. Подключение бесплатно при заключении договора.</p>
        </div>
      </section>

      {/* ─── SPEED TEST BANNER ─── */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/speedtest" className="block group">
            <div className="relative rounded-3xl overflow-hidden px-8 py-8 md:px-14 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6"
              style={{ background: "linear-gradient(120deg, rgba(0,212,255,0.08) 0%, rgba(168,85,247,0.08) 50%, rgba(0,245,122,0.08) 100%)", border: "1px solid rgba(0,212,255,0.15)" }}>
              {/* glow blobs */}
              <div className="absolute left-0 top-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: "rgba(0,212,255,0.07)", filter: "blur(80px)" }} />
              <div className="absolute right-0 bottom-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: "rgba(0,245,122,0.07)", filter: "blur(80px)" }} />

              <div className="relative z-10 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,245,122,0.1))", border: "1px solid rgba(0,212,255,0.25)" }}>
                  <Icon name="Gauge" size={28} style={{ color: "var(--neon-blue)" }} />
                </div>
                <div>
                  <div className="font-montserrat font-black text-xl md:text-2xl text-white mb-1">Проверь скорость своего интернета</div>
                  <div className="text-white/45 text-sm">Бесплатный тест — результат за 10 секунд. Пинг, загрузка и отдача.</div>
                </div>
              </div>

              <div className="relative z-10 shrink-0 flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 group-hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))", color: "#0b0e17", boxShadow: "0 0 24px rgba(0,212,255,0.2)" }}>
                <Icon name="Zap" size={16} />
                Начать тест
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ─── COVERAGE ─── */}
      <section id="coverage" className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4 tracking-wider uppercase" style={{ borderColor: "rgba(0,245,122,0.3)", background: "rgba(0,245,122,0.05)", color: "var(--neon-green)" }}>
              <Icon name="MapPin" size={12} /> Зона покрытия
            </div>
            <h2 className="font-montserrat font-black text-4xl md:text-5xl mb-4">
              42 города<br /><span className="gradient-text-green">и продолжаем расширяться</span>
            </h2>
          </div>

          <div className="glass-card rounded-3xl border border-white/5 overflow-hidden relative">
            <img src={CITY_IMG} alt="Карта покрытия" className="w-full h-[420px] object-cover opacity-30" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent, transparent, rgba(11,14,23,0.8))" }} />

            {coverageCities.map((city, i) => (
              <div key={i} className="absolute flex flex-col items-center gap-1" style={{ top: city.top, left: city.left }}>
                <div className="relative w-3 h-3">
                  <div className="w-3 h-3 rounded-full coverage-dot" style={{ background: "var(--neon-green)", animationDelay: `${i * 0.2}s` }} />
                  <div className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(0,245,122,0.3)", animationDelay: `${i * 0.3}s` }} />
                </div>
                <span className="text-[10px] text-white/80 font-medium bg-black/50 px-1 rounded whitespace-nowrap">{city.name}</span>
              </div>
            ))}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6">
              <div className="glass-card rounded-2xl p-4 border border-white/10">
                <p className="text-sm text-white/60 mb-3 text-center">Проверьте доступность по адресу</p>
                <div className="flex gap-2">
                  <input type="text" placeholder="Введите адрес..." className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                  <button className="px-4 py-2.5 rounded-xl text-[#0b0e17] font-bold text-sm neon-glow-btn whitespace-nowrap" style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}>Проверить</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img src={WORK_IMG} alt="Команда АртТелеком Юг" className="rounded-3xl w-full object-cover h-[440px]" />
              <div className="absolute -bottom-6 -right-6 glass-card neon-border-blue rounded-2xl p-5 max-w-[200px]">
                <div className="font-montserrat font-black text-3xl gradient-text-green">14</div>
                <div className="text-white/50 text-sm">лет на рынке связи</div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-6 tracking-wider uppercase" style={{ borderColor: "rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.05)", color: "rgb(192,132,252)" }}>
                <Icon name="Info" size={12} /> О компании
              </div>
              <h2 className="font-montserrat font-black text-4xl md:text-5xl mb-6">
                Мы строим<br /><span className="gradient-text-full">цифровую инфраструктуру</span><br />России
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-4">АртТелеком Юг основана в 2012 году. Мы прокладываем оптоволоконные сети и предоставляем услуги связи для домов, бизнеса и государственных учреждений юга России.</p>
              <p className="text-white/60 text-base leading-relaxed mb-8">Более 280 000 абонентов доверяют нам свой интернет. Мы инвестируем в собственную инфраструктуру, поэтому гарантируем стабильность и скорость без посредников.</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "Award", text: "Лидер рынка 2024–2025" },
                  { icon: "Users", text: "Команда 2400+ человек" },
                  { icon: "Server", text: "Собственная инфраструктура" },
                  { icon: "HeartHandshake", text: "Поддержка 24/7/365" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <Icon name={item.icon} size={18} style={{ color: "var(--neon-blue)" }} className="shrink-0" />
                    <span className="text-sm text-white/70">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BLOG ─── */}
      <section id="blog" className="py-20 relative">
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4 tracking-wider uppercase" style={{ borderColor: "rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.05)", color: "var(--neon-blue)" }}>
                <Icon name="BookOpen" size={12} /> Блог
              </div>
              <h2 className="font-montserrat font-black text-4xl">Полезно<br /><span className="gradient-text-blue">знать</span></h2>
            </div>
            <Link to="/blog" className="hidden md:flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all" style={{ color: "var(--neon-blue)" }}>
              Все статьи <Icon name="ArrowRight" size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden border border-white/5 card-hover group cursor-pointer">
                <div className="h-44 overflow-hidden relative">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.5)", color: "var(--neon-blue)" }}>{post.tag}</div>
                </div>
                <div className="p-5">
                  <div className="text-white/30 text-xs mb-2">{post.date}</div>
                  <h3 className="font-semibold text-base text-white mb-2 leading-snug group-hover:text-[#00d4ff] transition-colors">{post.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed line-clamp-2">{post.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4 tracking-wider uppercase" style={{ borderColor: "rgba(0,245,122,0.3)", background: "rgba(0,245,122,0.05)", color: "var(--neon-green)" }}>
              <Icon name="HelpCircle" size={12} /> FAQ
            </div>
            <h2 className="font-montserrat font-black text-4xl md:text-5xl">Частые<br /><span className="gradient-text-green">вопросы</span></h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="glass-card rounded-2xl border transition-all duration-300" style={{ borderColor: openFaq === i ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.05)", background: openFaq === i ? "rgba(0,212,255,0.05)" : "" }}>
                <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-white text-sm md:text-base">{item.q}</span>
                  <Icon name="Plus" size={18} className="shrink-0 transition-transform duration-300" style={{ color: "var(--neon-blue)", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACTS ─── */}
      <section id="contacts" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.05), transparent, rgba(0,245,122,0.05))" }} />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4 tracking-wider uppercase" style={{ borderColor: "rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.05)", color: "var(--neon-blue)" }}>
              <Icon name="MessageSquare" size={12} /> Контакты
            </div>
            <h2 className="font-montserrat font-black text-4xl md:text-5xl">Свяжитесь<br /><span className="gradient-text-blue">с нами</span></h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              {[
                { icon: "Phone", label: "Единый номер", val: "+7 902 404-88-50", sub: "Бесплатно по России" },
                { icon: "Mail", label: "Email", val: "hello@svyazpro.ru", sub: "Ответим в течение 2 часов" },
                { icon: "MapPin", label: "Головной офис", val: "Москва, ул. Цифровая, 1", sub: "Пн–Пт 9:00–18:00" },
                { icon: "MessageCircle", label: "Онлайн-чат", val: "В личном кабинете", sub: "24/7 без ожидания" },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-4 glass-card rounded-2xl p-4 border border-white/5 card-hover">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(0,212,255,0.1)", color: "var(--neon-blue)" }}>
                    <Icon name={c.icon} size={20} />
                  </div>
                  <div>
                    <div className="text-white/40 text-xs mb-0.5">{c.label}</div>
                    <div className="text-white font-semibold text-sm">{c.val}</div>
                    <div className="text-white/30 text-xs">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-3xl p-8 border border-white/5">
              <h3 className="font-montserrat font-bold text-xl mb-6 text-white">Оставить заявку</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Ваше имя</label>
                  <input type="text" placeholder="Алексей Смирнов" className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Телефон</label>
                  <input type="tel" placeholder="+7 (999) 000-00-00" className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Тема</label>
                  <select className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <option value="" style={{ background: "#111827" }}>Подключение интернета</option>
                    <option value="support" style={{ background: "#111827" }}>Техническая поддержка</option>
                    <option value="billing" style={{ background: "#111827" }}>Вопрос по счёту</option>
                    <option value="other" style={{ background: "#111827" }}>Другое</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Сообщение</label>
                  <textarea rows={3} placeholder="Опишите ваш вопрос..." className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none transition-colors resize-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <button className="w-full py-3.5 rounded-xl text-[#0b0e17] font-bold text-sm neon-glow-btn" style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}>
                  Отправить заявку
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}>
                  <Icon name="Wifi" size={16} className="text-[#0b0e17]" />
                </div>
                <span className="font-montserrat font-black text-xl">
                  <span style={{ color: "var(--neon-blue)" }}>Связь</span><span className="text-white">Про</span>
                </span>
              </div>
              <p className="text-white/30 text-sm leading-relaxed mb-4">Быстрый интернет и надёжная связь для дома и бизнеса с 2012 года.</p>
              <div className="flex gap-3">
                {["VK", "TG", "YT"].map(s => (
                  <a key={s} href="#" className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-[#00d4ff] hover:border-[rgba(0,212,255,0.3)] transition-all text-xs font-bold" style={{ background: "rgba(255,255,255,0.05)" }}>{s}</a>
                ))}
              </div>
            </div>
            {[
              { title: "Услуги", links: ["Домашний интернет", "Бизнес-интернет", "Цифровое ТВ", "IP-телефония", "Антивирус"] },
              { title: "Компания", links: ["О нас", "Блог", "Вакансии", "Пресс-центр", "Партнёрам"] },
              { title: "Поддержка", links: ["Личный кабинет", "FAQ", "Тех. поддержка", "Оплата", "Документы"] },
            ].map((col, i) => (
              <div key={i}>
                <div className="text-white/70 font-semibold text-sm mb-4">{col.title}</div>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="text-white/30 text-sm hover:text-[#00d4ff] transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="section-divider mb-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/20">
            <span>© 2026 АртТелеком Юг. Все права защищены.</span>
            <div className="flex gap-6">
              {["Политика конфиденциальности", "Пользовательское соглашение", "Оферта"].map(t => (
                <a key={t} href="#" className="hover:text-white/50 transition-colors">{t}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ─── ЛИЧНЫЙ КАБИНЕТ MODAL ─── */}
      {lkOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.7)" }} onClick={() => setLkOpen(false)} />
          <div className="relative w-full max-w-2xl glass-card rounded-3xl border overflow-hidden animate-scale-in" style={{ borderColor: "rgba(0,212,255,0.2)" }}>
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}>
                  <Icon name="User" size={18} className="text-[#0b0e17]" />
                </div>
                <div>
                  <div className="font-bold text-white">Личный кабинет</div>
                  <div className="text-xs text-white/30">АртТелеком Юг</div>
                </div>
              </div>
              <button onClick={() => setLkOpen(false)} className="text-white/30 hover:text-white transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>

            {!isLoggedIn ? (
              <div className="p-8">
                <h3 className="font-montserrat font-black text-2xl mb-2 text-white">Войдите в аккаунт</h3>
                <p className="text-white/40 text-sm mb-6">Управляйте подпиской, счетами и поддержкой</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block">Логин или телефон</label>
                    <input type="text" placeholder="+7 (999) 000-00-00" value={loginForm.login} onChange={e => setLoginForm(f => ({ ...f, login: e.target.value }))} className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block">Пароль</label>
                    <input type="password" placeholder="••••••••" value={loginForm.pass} onChange={e => setLoginForm(f => ({ ...f, pass: e.target.value }))} className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                  </div>
                  <button onClick={() => setIsLoggedIn(true)} className="w-full py-3.5 rounded-xl text-[#0b0e17] font-bold text-sm neon-glow-btn" style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}>
                    Войти
                  </button>
                  <div className="flex items-center justify-between text-xs text-white/30">
                    <a href="#" className="hover:text-[#00d4ff] transition-colors">Забыл пароль</a>
                    <a href="#" className="hover:text-[#00f57a] transition-colors">Зарегистрироваться</a>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex border-b border-white/5">
                  {(["dashboard", "bills", "support"] as const).map(tab => (
                    <button key={tab} onClick={() => setLkTab(tab)} className={`flex-1 py-3 text-sm font-semibold transition-all ${lkTab === tab ? "border-b-2 border-[#00d4ff] bg-[rgba(0,212,255,0.05)]" : "text-white/40 hover:text-white"}`} style={lkTab === tab ? { color: "var(--neon-blue)" } : {}}>
                      {tab === "dashboard" ? "Главная" : tab === "bills" ? "Счета" : "Поддержка"}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {lkTab === "dashboard" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-2xl border" style={{ background: "rgba(0,212,255,0.05)", borderColor: "rgba(0,212,255,0.2)" }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-montserrat font-black text-[#0b0e17]" style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}>АС</div>
                        <div>
                          <div className="font-bold text-white">Алексей Смирнов</div>
                          <div className="text-xs text-white/40">Лицевой счёт: 1234567</div>
                        </div>
                        <div className="ml-auto text-right">
                          <div className="text-xs text-white/40">Баланс</div>
                          <div className="font-montserrat font-black text-xl gradient-text-green">+486 ₽</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-2xl border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                          <div className="text-xs text-white/40 mb-1">Тариф</div>
                          <div className="font-semibold text-white">Оптима</div>
                          <div className="text-sm" style={{ color: "var(--neon-blue)" }}>300 Мбит/с</div>
                        </div>
                        <div className="p-4 rounded-2xl border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                          <div className="text-xs text-white/40 mb-1">Статус</div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--neon-green)" }} />
                            <span className="font-semibold" style={{ color: "var(--neon-green)" }}>Активен</span>
                          </div>
                          <div className="text-white/30 text-xs">до 11 мая 2026</div>
                        </div>
                      </div>
                      <button className="w-full py-3 rounded-xl font-semibold text-sm hover:bg-[rgba(0,212,255,0.05)] transition-all" style={{ border: "1px solid rgba(0,212,255,0.3)", color: "var(--neon-blue)" }}>
                        Сменить тариф
                      </button>
                    </div>
                  )}

                  {lkTab === "bills" && (
                    <div className="space-y-3">
                      {[{ month: "Апрель 2026", paid: true }, { month: "Март 2026", paid: true }].map((b, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                          <div>
                            <div className="text-sm font-semibold text-white">{b.month}</div>
                            <div className="text-xs text-white/30">Тариф Оптима</div>
                          </div>
                          <span className="text-sm font-bold" style={{ color: "var(--neon-green)" }}>Оплачен</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between p-3 rounded-xl border" style={{ background: "rgba(249,115,22,0.1)", borderColor: "rgba(249,115,22,0.2)" }}>
                        <div>
                          <div className="text-sm font-semibold text-white">Май 2026</div>
                          <div className="text-xs text-white/30">649 ₽</div>
                        </div>
                        <button className="px-3 py-1 rounded-lg text-[#0b0e17] font-bold text-xs" style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}>Оплатить</button>
                      </div>
                    </div>
                  )}

                  {lkTab === "support" && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl flex items-center gap-3 border" style={{ background: "rgba(0,245,122,0.05)", borderColor: "rgba(0,245,122,0.2)" }}>
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--neon-green)" }} />
                        <span className="text-sm text-white/70">Нет активных заявок</span>
                      </div>
                      <div className="space-y-2">
                        {[{ icon: "MessageCircle", label: "Онлайн-чат", desc: "Ответим за 2 минуты" }, { icon: "Phone", label: "+7 902 404-88-50", desc: "Бесплатно" }, { icon: "Mail", label: "hello@svyazpro.ru", desc: "Ответим за 2 часа" }].map((c, i) => (
                          <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-[rgba(0,212,255,0.3)] transition-all text-left" style={{ background: "rgba(255,255,255,0.03)" }}>
                            <Icon name={c.icon} size={16} style={{ color: "var(--neon-blue)" }} className="shrink-0" />
                            <div>
                              <div className="text-sm font-semibold text-white">{c.label}</div>
                              <div className="text-xs text-white/30">{c.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                    <button onClick={() => { setIsLoggedIn(false); setLoginForm({ login: "", pass: "" }); }} className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                      <Icon name="LogOut" size={12} /> Выйти
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}