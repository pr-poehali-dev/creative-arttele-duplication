import { useState } from "react";
import { useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import AiChatPanel from "@/components/AiChatPanel";

const HIDDEN_PATHS = ["/dashboard", "/login", "/video/login", "/video/cabinet"];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  if (HIDDEN_PATHS.some(p => location.pathname.startsWith(p))) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110"
        style={{
          background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))",
          boxShadow: "0 8px 32px rgba(0,212,255,0.4)",
        }}
        aria-label={open ? "Закрыть чат" : "Открыть чат"}
      >
        <Icon name={open ? "X" : "MessageCircle"} size={24} className="text-[#0b0e17]" />
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-[100] w-[360px] max-w-[calc(100vw-3rem)] h-[540px] max-h-[calc(100vh-8rem)] rounded-2xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-xl"
          style={{
            background: "rgba(11,14,23,0.95)",
            border: "1px solid rgba(0,212,255,0.25)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.1)",
          }}
        >
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}
            >
              <Icon name="Sparkles" size={18} className="text-[#0b0e17]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm">Консультант АртТелеком Юг</div>
              <div className="text-xs text-white/50 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)] animate-pulse" />
                На связи
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              aria-label="Закрыть"
            >
              <Icon name="X" size={16} />
            </button>
          </div>

          <div className="flex-1 min-h-0">
            <AiChatPanel
              mode="site"
              greeting="Здравствуйте! Я консультант АртТелеком Юг 👋 Помогу подобрать тариф, расскажу об услугах и оформлю заявку на подключение. Что вас интересует?"
              placeholder="Спросите о тарифах, подключении..."
            />
          </div>
        </div>
      )}
    </>
  );
}