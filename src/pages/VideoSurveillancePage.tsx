import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Icon from "@/components/ui/icon";

const services = [
  {
    icon: "Camera",
    title: "Установка камер",
    desc: "Монтируем камеры видеонаблюдения любой сложности: квартиры, офисы, склады, стройплощадки. Аналоговые, IP, 4K.",
    color: "var(--neon-blue)",
  },
  {
    icon: "Settings",
    title: "Настройка системы",
    desc: "Конфигурируем видеорегистраторы, настраиваем удалённый доступ, оповещения и запись по расписанию.",
    color: "var(--neon-green)",
  },
  {
    icon: "ShoppingCart",
    title: "Продажа оборудования",
    desc: "Поставляем сертифицированные камеры и регистраторы ведущих брендов. Гарантия от производителя.",
    color: "var(--neon-purple)",
  },
  {
    icon: "Wifi",
    title: "Беспроводные системы",
    desc: "Wi-Fi и 4G камеры там, где нет кабеля. Идеально для дач, парковок и временных объектов.",
    color: "var(--neon-blue)",
  },
  {
    icon: "Cloud",
    title: "Облачное хранение",
    desc: "Запись видео в облако — доступ с телефона 24/7. Никакого локального оборудования для хранения.",
    color: "var(--neon-green)",
  },
  {
    icon: "Shield",
    title: "Техническое обслуживание",
    desc: "Регулярное ТО, диагностика, замена оборудования. Договор на обслуживание с приоритетным выездом.",
    color: "var(--neon-purple)",
  },
];

const packages = [
  {
    name: "Старт",
    cameras: "2–4 камеры",
    price: "от 15 000 ₽",
    ideal: "Квартира, небольшой офис",
    features: ["Монтаж и настройка", "Запись на регистратор", "Удалённый доступ", "Инструктаж"],
    color: "var(--neon-blue)",
    popular: false,
  },
  {
    name: "Бизнес",
    cameras: "8–16 камер",
    price: "от 45 000 ₽",
    ideal: "Магазин, склад, производство",
    features: ["Монтаж и настройка", "Облачное резервирование", "Аналитика движения", "Оповещения на телефон", "Договор ТО на 1 год"],
    color: "var(--neon-green)",
    popular: true,
  },
  {
    name: "Объект",
    cameras: "32+ камеры",
    price: "по запросу",
    ideal: "Жилые комплексы, предприятия",
    features: ["Проект под ключ", "IP камеры 4K", "Центральный пульт", "Интеграция с СКУД", "Приоритетная поддержка 24/7", "Договор ТО"],
    color: "var(--neon-purple)",
    popular: false,
  },
];

const stats = [
  { value: "500+", label: "Объектов сдано" },
  { value: "8 лет", label: "На рынке" },
  { value: "24/7", label: "Техподдержка" },
  { value: "1 день", label: "Срок монтажа" },
];

const faqs = [
  {
    q: "Сколько хранится запись?",
    a: "Зависит от пакета и объёма накопителя. Стандартно — 30 дней, при облачном хранении — от 7 до 90 дней.",
  },
  {
    q: "Можно смотреть камеры с телефона?",
    a: "Да, настраиваем удалённый доступ через приложение для iOS и Android. Смотрите онлайн из любой точки мира.",
  },
  {
    q: "Работают ли камеры ночью?",
    a: "Все камеры оснащены ИК-подсветкой. Видят чёткое изображение в полной темноте на расстоянии до 50 метров.",
  },
  {
    q: "Как долго длится монтаж?",
    a: "Базовую систему из 4 камер устанавливаем за 1 рабочий день. Крупные объекты — по согласованному графику.",
  },
];

export default function VideoSurveillancePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ background: "var(--dark-bg)" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* bg glow blobs */}
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px] pointer-events-none"
          style={{ background: "var(--neon-blue)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] pointer-events-none"
          style={{ background: "var(--neon-purple)" }}
        />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 tracking-widest uppercase"
              style={{
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.3)",
                color: "var(--neon-blue)",
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--neon-blue)" }} />
              Видеонаблюдение под ключ
            </div>

            <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-6">
              Контролируйте всё.{" "}
              <span
                className="relative"
                style={{
                  background: "linear-gradient(90deg, var(--neon-blue), var(--neon-green))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Везде.
              </span>{" "}
              <br />
              Всегда.
            </h1>

            <p className="text-white/60 text-lg mb-8 max-w-lg leading-relaxed">
              Профессиональная установка, настройка и продажа систем видеонаблюдения. От 2 камер в квартире до 100+ на промышленном объекте.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+78002002024"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-base transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))",
                  color: "#0b0e17",
                  boxShadow: "0 0 32px rgba(0,212,255,0.35)",
                }}
              >
                <Icon name="Phone" size={18} />
                Вызвать специалиста
              </a>
              <a
                href="#packages"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:bg-white/10"
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                }}
              >
                <Icon name="Package" size={18} />
                Смотреть пакеты
              </a>
            </div>

            {/* mini stats */}
            <div className="grid grid-cols-4 gap-4 mt-12">
              {stats.map((s) => (
                <div key={s.value} className="text-center">
                  <div className="text-2xl font-black" style={{ color: "var(--neon-blue)" }}>
                    {s.value}
                  </div>
                  <div className="text-white/40 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-3xl blur-2xl opacity-30"
              style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))" }}
            />
            <img
              src="https://cdn.poehali.dev/projects/5573dd0c-764b-4bc3-951f-74ecfdbb396f/files/799e804e-0685-4b2a-951f-0470d635f666.jpg"
              alt="Система видеонаблюдения"
              className="relative w-full rounded-3xl object-cover"
              style={{
                border: "1px solid rgba(0,212,255,0.2)",
                boxShadow: "0 0 60px rgba(0,212,255,0.15)",
                aspectRatio: "4/3",
              }}
            />
            {/* floating badges */}
            <div
              className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
              style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(0,212,255,0.3)", color: "var(--neon-blue)", backdropFilter: "blur(10px)" }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
              REC 24/7
            </div>
            <div
              className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
              style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(0,245,122,0.3)", color: "var(--neon-green)", backdropFilter: "blur(10px)" }}
            >
              <Icon name="Shield" size={14} />
              Защита активна
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--neon-blue)" }}>
              Что мы делаем
            </p>
            <h2 className="text-3xl lg:text-5xl font-black text-white">
              Полный цикл услуг
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="group p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}33` }}
                >
                  <Icon name={s.icon} size={26} style={{ color: s.color }} />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Camera grid demo */}
      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-4 tracking-widest uppercase"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.35)",
                color: "#ef4444",
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#ef4444" }} />
              Live — мониторинг объектов
            </div>
            <h2 className="text-2xl lg:text-4xl font-black text-white">
              Пример интерфейса видеонаблюдения
            </h2>
          </div>

          <div
            className="rounded-3xl overflow-hidden p-4"
            style={{
              background: "#0a0c14",
              border: "1px solid rgba(0,212,255,0.2)",
              boxShadow: "0 0 60px rgba(0,212,255,0.1)",
            }}
          >
            {/* top bar */}
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#ef4444" }} />
                <span className="text-white/50 text-xs font-mono">REC • 4 камеры активны</span>
              </div>
              <span className="text-white/30 text-xs font-mono">
                {new Date().toLocaleDateString("ru-RU")} 24/7
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Вход • Камера 1", img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=640&q=80", color: "#00d4ff" },
                { label: "Парковка • Камера 2", img: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=640&q=80", color: "#00f57a" },
                { label: "Склад • Камера 3", img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=640&q=80", color: "#00d4ff" },
                { label: "Офис • Камера 4", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=640&q=80", color: "#a855f7" },
              ].map((cam) => (
                <div key={cam.label} className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <img src={cam.img} alt={cam.label} className="w-full h-full object-cover" style={{ filter: "brightness(0.75) saturate(0.7)" }} />
                  {/* scanline overlay */}
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)" }} />
                  {/* corner markers */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl" style={{ borderColor: cam.color }} />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr" style={{ borderColor: cam.color }} />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl" style={{ borderColor: cam.color }} />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br" style={{ borderColor: cam.color }} />
                  {/* label */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#ef4444" }} />
                    <span className="text-white/80 text-xs font-mono">{cam.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-white/30 text-xs mt-4">
            Демонстрационный режим — пример интерфейса мониторинга
          </p>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--neon-purple)" }}>
              Пакеты услуг
            </p>
            <h2 className="text-3xl lg:text-5xl font-black text-white">
              Выберите свой пакет
            </h2>
            <p className="text-white/40 mt-4 max-w-lg mx-auto">
              Фиксированные цены, никаких скрытых платежей. Монтаж и настройка уже включены.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className="relative p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: pkg.popular ? `${pkg.color}0d` : "var(--glass-bg)",
                  border: `1px solid ${pkg.popular ? pkg.color + "55" : "var(--glass-border)"}`,
                  boxShadow: pkg.popular ? `0 0 40px ${pkg.color}20` : "none",
                }}
              >
                {pkg.popular && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase"
                    style={{ background: pkg.color, color: "#0b0e17" }}
                  >
                    Популярный
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-black text-white mb-1">{pkg.name}</h3>
                  <p className="text-sm" style={{ color: pkg.color }}>{pkg.cameras}</p>
                  <p className="text-white/40 text-xs mt-1">{pkg.ideal}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-black text-white">{pkg.price}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                      <Icon name="CheckCircle" size={16} style={{ color: pkg.color, flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="tel:+78002002024"
                  className="block text-center py-3.5 rounded-2xl font-bold text-sm transition-all hover:opacity-90"
                  style={
                    pkg.popular
                      ? { background: pkg.color, color: "#0b0e17" }
                      : { border: `1px solid ${pkg.color}55`, color: pkg.color }
                  }
                >
                  Заказать
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--neon-blue)" }}>
              Процесс работы
            </p>
            <h2 className="text-3xl lg:text-5xl font-black text-white">
              4 шага до безопасности
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", icon: "Phone", title: "Заявка", desc: "Звоните или оставляйте заявку — ответим за 15 минут" },
              { step: "02", icon: "MapPin", title: "Выезд", desc: "Бесплатный замер и консультация на объекте" },
              { step: "03", icon: "Wrench", title: "Монтаж", desc: "Устанавливаем аккуратно, без лишнего мусора" },
              { step: "04", icon: "Smartphone", title: "Сдача", desc: "Настраиваем, обучаем, выдаём гарантию" },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center group">
                {i < 3 && (
                  <div
                    className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px"
                    style={{ background: "linear-gradient(90deg, rgba(0,212,255,0.4), transparent)" }}
                  />
                )}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)" }}
                >
                  <Icon name={item.icon} size={24} style={{ color: "var(--neon-blue)" }} />
                </div>
                <div className="text-xs font-black tracking-widest mb-2" style={{ color: "var(--neon-blue)" }}>
                  {item.step}
                </div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--neon-green)" }}>
              FAQ
            </p>
            <h2 className="text-3xl lg:text-5xl font-black text-white">
              Частые вопросы
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden transition-all duration-200"
                style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-white font-semibold pr-4">{faq.q}</span>
                  <Icon
                    name={openFaq === i ? "ChevronUp" : "ChevronDown"}
                    size={20}
                    style={{ color: "var(--neon-blue)", flexShrink: 0 }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-white/60 text-sm leading-relaxed border-t" style={{ borderColor: "var(--glass-border)" }}>
                    <p className="pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto relative">
          <div
            className="absolute inset-0 rounded-3xl blur-3xl opacity-20"
            style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))" }}
          />
          <div
            className="relative p-12 lg:p-16 rounded-3xl text-center"
            style={{
              background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(168,85,247,0.08))",
              border: "1px solid rgba(0,212,255,0.2)",
            }}
          >
            <div className="text-6xl mb-6">📡</div>
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">
              Готовы защитить ваш объект?
            </h2>
            <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
              Бесплатный выезд специалиста и расчёт стоимости в течение 1 дня.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+78002002024"
                className="flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))",
                  color: "#0b0e17",
                  boxShadow: "0 0 40px rgba(0,212,255,0.4)",
                }}
              >
                <Icon name="Phone" size={20} />
                Позвонить бесплатно
              </a>
              <Link
                to="/contacts"
                className="flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold text-base transition-all hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "white" }}
              >
                <Icon name="MessageSquare" size={18} />
                Написать нам
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer space */}
      <div className="pb-12" />
    </div>
  );
}