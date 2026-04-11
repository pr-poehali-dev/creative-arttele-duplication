import Navbar from "@/components/Navbar";
import Icon from "@/components/ui/icon";
import { contacts, formTopics } from "@/data/contacts";

export default function ContactsPage() {
  return (
    <div className="min-h-screen mesh-bg noise font-sans text-white">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4 tracking-wider uppercase" style={{ borderColor: "rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.05)", color: "var(--neon-blue)" }}>
              <Icon name="MessageSquare" size={12} /> Контакты
            </div>
            <h1 className="font-montserrat font-black text-5xl md:text-6xl">
              Свяжитесь<br /><span className="gradient-text-blue">с нами</span>
            </h1>
          </div>



          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              {contacts.map((c, i) => {
                const inner = (
                  <>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: c.link ? "rgba(0,212,255,0.15)" : "rgba(0,212,255,0.1)", color: "var(--neon-blue)" }}>
                      <Icon name={c.icon} size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="text-white/40 text-xs mb-0.5">{c.label}</div>
                      <div className="text-white font-semibold">{c.value}</div>
                      <div className="text-white/30 text-xs">{c.sub}</div>
                    </div>
                    {c.link && (
                      <div className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))", color: "#0b0e17" }}>
                        Написать →
                      </div>
                    )}
                  </>
                );
                return c.link ? (
                  <a key={i} href={c.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 glass-card rounded-2xl p-5 border border-white/10 card-hover cursor-pointer no-underline">
                    {inner}
                  </a>
                ) : (
                  <div key={i} className="flex items-center gap-4 glass-card rounded-2xl p-5 border border-white/5 card-hover">
                    {inner}
                  </div>
                );
              })}
            </div>

            <div className="glass-card rounded-3xl p-8 border border-white/5">
              <h2 className="font-montserrat font-bold text-xl mb-6 text-white">Оставить заявку</h2>
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
                    {formTopics.map(t => (
                      <option key={t} value={t} style={{ background: "#111827" }}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Сообщение</label>
                  <textarea rows={4} placeholder="Опишите ваш вопрос..." className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none transition-colors resize-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <button className="w-full py-3.5 rounded-xl text-[#0b0e17] font-bold text-sm neon-glow-btn" style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}>
                  Отправить заявку
                </button>
              </div>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
}