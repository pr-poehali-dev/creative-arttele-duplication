import { useState } from "react";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/ui/PageHero";
import Icon from "@/components/ui/icon";
import faq from "@/data/faq";

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen mesh-bg noise font-sans text-white">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">

          <PageHero
            badge="FAQ"
            badgeIcon="HelpCircle"
            title="Частые"
            highlight="вопросы"
            subtitle="Ответы на самые популярные вопросы наших клиентов"
            accent="green"
          />

          <div className="space-y-3">
            {faq.map((item, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl border transition-all duration-300"
                style={{
                  borderColor: open === i ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.05)",
                  background: open === i ? "rgba(0,212,255,0.05)" : "",
                }}
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-semibold text-white text-sm md:text-base pr-4">{item.q}</span>
                  <Icon
                    name="Plus"
                    size={18}
                    className="shrink-0 transition-transform duration-300"
                    style={{ color: "var(--neon-blue)", transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                  />
                </button>
                {open === i && (
                  <div className="px-5 pb-5 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Big chameleon banner */}
        <div className="relative mt-16 rounded-3xl overflow-hidden" style={{ height: 300 }}>
          <img
            src="https://cdn.poehali.dev/projects/5573dd0c-764b-4bc3-951f-74ecfdbb396f/files/72388478-317c-437c-80c0-732b01eb7287.jpg"
            alt=""
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 20%, rgba(11,14,23,0.9) 100%)" }} />
          <div className="absolute bottom-0 left-0 right-0 text-center pb-8">
            <p className="text-white/60 text-sm">Не нашли ответ?</p>
            <a href="/contacts" className="font-montserrat font-black text-xl text-white hover:text-[#00d4ff] transition-colors">Напишите нам →</a>
          </div>
        </div>

      </div>
    </div>
  );
}