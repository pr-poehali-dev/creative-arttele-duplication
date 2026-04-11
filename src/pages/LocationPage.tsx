import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Icon from "@/components/ui/icon";
import locations from "@/data/locations";

const colorMap = {
  blue:   { border: "rgba(0,212,255,0.3)",  bg: "rgba(0,212,255,0.08)",  text: "var(--neon-blue)",  badge: "rgba(0,212,255,0.15)" },
  green:  { border: "rgba(0,245,122,0.3)",  bg: "rgba(0,245,122,0.08)",  text: "var(--neon-green)", badge: "rgba(0,245,122,0.15)" },
  purple: { border: "rgba(168,85,247,0.3)", bg: "rgba(168,85,247,0.08)", text: "#a855f7",            badge: "rgba(168,85,247,0.15)" },
};

const badgeColor: Record<string, string> = {
  "Акция":     "rgba(0,212,255,0.15)",
  "Подарок":   "rgba(0,245,122,0.15)",
  "Выгода":    "rgba(168,85,247,0.15)",
  "Льгота":    "rgba(168,85,247,0.15)",
  "Дачникам":  "rgba(0,245,122,0.15)",
  "Бесплатно": "rgba(0,245,122,0.15)",
  "Реферал":   "rgba(0,212,255,0.15)",
  "Новинка":   "rgba(249,115,22,0.15)",
};

export default function LocationPage() {
  const { slug } = useParams<{ slug: string }>();
  const loc = locations.find(l => l.slug === slug);

  if (!loc) {
    return (
      <div className="min-h-screen mesh-bg noise font-sans text-white flex flex-col items-center justify-center gap-4">
        <Navbar />
        <Icon name="MapPin" size={48} className="text-white/20" />
        <p className="text-white/40 text-lg">Населённый пункт не найден</p>
        <Link to="/locations" className="text-sm font-semibold" style={{ color: "var(--neon-blue)" }}>
          ← Все населённые пункты
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg noise font-sans text-white">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/30 mb-8">
            <Link to="/locations" className="hover:text-white/60 transition-colors">Населённые пункты</Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-white/60">{loc.name}</span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4 tracking-wider uppercase" style={{ borderColor: "rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.05)", color: "var(--neon-blue)" }}>
              <Icon name="MapPin" size={12} /> Тарифы для вашего района
            </div>
            <h1 className="font-montserrat font-black text-5xl md:text-6xl mb-3">
              {loc.name}
            </h1>
            <p className="text-white/50 text-lg max-w-2xl">{loc.description}</p>
          </div>

          {/* Акции */}
          {loc.promos.length > 0 && (
            <div className="mb-14">
              <h2 className="font-montserrat font-bold text-2xl mb-5 flex items-center gap-2">
                <Icon name="Sparkles" size={20} style={{ color: "var(--neon-green)" }} />
                Акции и спецпредложения
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loc.promos.map((promo, i) => {
                  const c = colorMap[promo.color];
                  return (
                    <div
                      key={i}
                      className="rounded-2xl p-6 border flex gap-4"
                      style={{ background: c.bg, borderColor: c.border }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: c.badge, color: c.text }}>
                        <Icon name="Gift" size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-white text-base">{promo.title}</span>
                          {promo.badge && (
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ background: badgeColor[promo.badge] ?? "rgba(255,255,255,0.1)", color: c.text }}
                            >
                              {promo.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-white/55 text-sm leading-relaxed">{promo.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Тарифы */}
          <div>
            <h2 className="font-montserrat font-bold text-2xl mb-5 flex items-center gap-2">
              <Icon name="Zap" size={20} style={{ color: "var(--neon-blue)" }} />
              Тарифы
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {loc.tariffs.map((t, i) => {
                const c = colorMap[t.color];
                return (
                  <div
                    key={i}
                    className="glass-card rounded-3xl p-6 border flex flex-col relative transition-all duration-300 hover:scale-[1.02]"
                    style={{ borderColor: t.popular ? c.border : "rgba(255,255,255,0.07)", background: t.popular ? c.bg : "" }}
                  >
                    {t.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-[#0b0e17]" style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}>
                        Популярный
                      </div>
                    )}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <div className="text-white/50 text-xs uppercase tracking-widest">{t.name}</div>
                        {t.badge && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(249,115,22,0.2)", color: "#fb923c" }}>
                            {t.badge}
                          </span>
                        )}
                      </div>
                      <div className="font-montserrat font-black text-4xl" style={{ color: c.text }}>
                        {t.speed} <span className="text-lg font-semibold text-white/40">Мбит/с</span>
                      </div>
                    </div>
                    <div className="mb-6 flex items-end gap-2">
                      <span className="font-montserrat font-black text-3xl text-white">{t.price} ₽</span>
                      <span className="text-white/30 text-sm mb-0.5">/ мес</span>
                      {t.oldPrice && (
                        <span className="text-white/25 text-sm line-through mb-0.5">{t.oldPrice} ₽</span>
                      )}
                    </div>
                    <ul className="space-y-2 flex-1 mb-6">
                      {t.features.map((f, fi) =>
                        f === "__social__" ? (
                          <li key={fi} className="pt-1">
                            <div className="text-white/40 text-xs mb-2">Включены без ограничений:</div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {[
                                { name: "WhatsApp",  src: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg",  bg: "#25D366" },
                                { name: "YouTube",   src: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg",   bg: "#FF0000" },
                                { name: "Telegram",  src: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/telegram.svg",  bg: "#26A5E4" },
                                { name: "Viber",     src: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/viber.svg",     bg: "#7360F2" },
                                { name: "Instagram", src: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg", bg: "#E4405F" },
                                { name: "Threads",   src: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/threads.svg",   bg: "#101010" },
                              ].map((s) => (
                                <div key={s.name} title={s.name}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                                  style={{ background: s.bg }}>
                                  <img src={s.src} alt={s.name} className="w-4 h-4 invert" />
                                </div>
                              ))}
                            </div>
                          </li>
                        ) : (
                          <li key={fi} className="flex items-center gap-2 text-sm text-white/70">
                            <Icon name="Check" size={14} style={{ color: c.text }} className="shrink-0" />
                            {f}
                          </li>
                        )
                      )}
                    </ul>
                    <Link
                      to="/contacts"
                      className="w-full py-3 rounded-xl font-bold text-sm transition-all text-center block"
                      style={t.popular
                        ? { background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))", color: "#0b0e17" }
                        : { border: `1px solid ${c.border}`, color: c.text }
                      }
                    >
                      Подключить
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-3xl p-8 border text-center" style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.07), rgba(0,245,122,0.04))", borderColor: "rgba(0,212,255,0.2)" }}>
            <h3 className="font-montserrat font-black text-2xl text-white mb-2">Остались вопросы?</h3>
            <p className="text-white/45 mb-5">Оставьте заявку — перезвоним в течение 30 минут</p>
            <Link
              to="/contacts"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-[#0b0e17] neon-glow-btn"
              style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}
            >
              Оставить заявку <Icon name="ArrowRight" size={15} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}