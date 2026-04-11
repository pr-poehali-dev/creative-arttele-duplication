import { useState } from "react";
import Navbar from "@/components/Navbar";
import Icon from "@/components/ui/icon";
import faq from "@/data/faq";

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen mesh-bg noise font-sans text-white">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">

          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4 tracking-wider uppercase" style={{ borderColor: "rgba(0,245,122,0.3)", background: "rgba(0,245,122,0.05)", color: "var(--neon-green)" }}>
              <Icon name="HelpCircle" size={12} /> FAQ
            </div>
            <h1 className="font-montserrat font-black text-5xl md:text-6xl">
              Частые<br /><span className="gradient-text-green">вопросы</span>
            </h1>

            {/* Chameleon */}
            <div className="flex justify-center mt-6">
              <div className="relative group">
                <div className="absolute -inset-2 rounded-full blur-xl opacity-35 group-hover:opacity-65 transition-opacity duration-500" style={{ background: "rgba(0,245,122,0.4)" }} />
                <img
                  src="https://cdn.poehali.dev/projects/5573dd0c-764b-4bc3-951f-74ecfdbb396f/files/2316df7c-8ee1-4efb-b0ab-79b3c1ca4f17.jpg"
                  alt="Хамелеон-голограмма"
                  className="relative w-24 h-24 rounded-full object-cover group-hover:rotate-6 transition-transform duration-500"
                  style={{ border: "1px solid rgba(0,245,122,0.4)", boxShadow: "0 0 24px rgba(0,245,122,0.2)" }}
                />
              </div>
            </div>
          </div>

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
      </div>
    </div>
  );
}