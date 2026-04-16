import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const faqItems = [
  { q: "Как быстро подключат интернет?", a: "Монтажник приезжает в течение 1–2 рабочих дней после заявки. Подключение занимает около 2 часов." },
  { q: "Можно ли подключить юридическое лицо?", a: "Да, мы работаем с юридическими лицами и ИП. Предлагаем специальные бизнес-тарифы с SLA и персональным менеджером." },
  { q: "Что входит в техподдержку 24/7?", a: "Звонки, чат и удалённая диагностика оборудования в любое время. Выезд мастера в рабочие часы." },
  { q: "Как сменить тариф?", a: "Через личный кабинет в 2 клика. Смена тарифа происходит моментально, без звонков и ожидания." },
  { q: "Есть ли контракт на определённый срок?", a: "Нет, мы работаем без обязательного срока контракта. Вы можете отключиться в любой момент." },
  { q: "Как оплатить услуги?", a: "Банковская карта, СБП, интернет-банкинг, автоплатёж — выбирайте удобный способ в личном кабинете." },
];

interface CoverageAndFaqProps {
  heroImg: string;
  cityImg: string;
  workImg: string;
}

export default function CoverageAndFaq({ heroImg, cityImg, workImg }: CoverageAndFaqProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const blogPosts = [
    { title: "Wi-Fi 6E vs Wi-Fi 7: что выбрать в 2026 году", date: "5 апреля 2026", tag: "Технологии", img: heroImg, desc: "Сравниваем новые стандарты беспроводной связи и объясняем, кому действительно нужен Wi-Fi 7." },
    { title: "Как повысить скорость Wi-Fi дома: 10 советов", date: "28 марта 2026", tag: "Советы", img: workImg, desc: "Расположение роутера, каналы, DNS — разбираем каждый пункт с практическими примерами." },
    { title: "Умный дом на базе нашей сети: реальные кейсы", date: "15 марта 2026", tag: "Кейсы", img: cityImg, desc: "Три истории клиентов, которые построили автоматизацию дома благодаря стабильному гигабитному интернету." },
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

  return (
    <>
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
            <img src={cityImg} alt="Карта покрытия" className="w-full h-[420px] object-cover opacity-30" />
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
              <img src={workImg} alt="Команда АртТелеком Юг" className="rounded-3xl w-full object-cover h-[440px]" />
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
    </>
  );
}
