import Navbar from "@/components/Navbar";
import PageHero from "@/components/ui/PageHero";
import { aboutInfo, stats, advantages, team } from "@/data/about";

export default function AboutPage() {
  return (
    <div className="min-h-screen mesh-bg noise font-sans text-white">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-6">

          <PageHero
            badge="О компании"
            badgeIcon="Building2"
            title="Мы строим"
            highlight="интернет будущего"
            subtitle={aboutInfo.description}
            accent="blue"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((s, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 border border-white/5 text-center">
                <div className="font-montserrat font-black text-4xl gradient-text-blue">
                  {s.num}<span className="text-2xl">{s.suffix}</span>
                </div>
                <div className="text-white/40 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>



          <div className="glass-card rounded-3xl p-8 border border-white/5 mb-10">
            <h2 className="font-montserrat font-bold text-2xl mb-4 text-white">Наша миссия</h2>
            <p className="text-white/60 text-base leading-relaxed">{aboutInfo.mission}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {advantages.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                <Icon name={item.icon} size={20} style={{ color: "var(--neon-blue)" }} className="shrink-0" />
                <span className="text-sm text-white/70">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Big chameleon banner */}
          <div className="relative mb-16 rounded-3xl overflow-hidden" style={{ height: 340 }}>
            <img
              src="https://cdn.poehali.dev/projects/5573dd0c-764b-4bc3-951f-74ecfdbb396f/files/1dc6c9fc-1647-492b-a701-e3eade7ac36a.jpg"
              alt=""
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(11,14,23,0.7) 0%, rgba(11,14,23,0.2) 50%, rgba(168,85,247,0.15) 100%)" }} />
            <div className="absolute inset-0 flex items-center justify-end px-10">
              <div className="text-right">
                <div className="font-montserrat font-black text-3xl md:text-4xl text-white mb-2">Исследуем<br />возможности</div>
                <p className="text-white/45 text-sm max-w-xs ml-auto">АртТелеком Юг — всегда впереди</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-montserrat font-bold text-2xl mb-6 text-white">Команда</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {team.map((m, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 border border-white/5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-montserrat font-black text-[#0b0e17] shrink-0" style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}>
                    {m.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{m.name}</div>
                    <div className="text-white/40 text-sm">{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}