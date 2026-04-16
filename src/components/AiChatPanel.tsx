import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import funcUrls from "../../backend/func2url.json";

export type ChatMessage = { role: "user" | "assistant"; content: string };

interface AiChatPanelProps {
  mode: "site" | "dashboard";
  context?: Record<string, unknown>;
  greeting: string;
  placeholder?: string;
  accentColor?: string;
  className?: string;
  inputClassName?: string;
}

export default function AiChatPanel({
  mode,
  context,
  greeting,
  placeholder = "Задайте вопрос...",
  accentColor = "var(--neon-blue)",
  className = "",
  inputClassName = "",
}: AiChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: greeting },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const url = (funcUrls as Record<string, string>)["send-contact"];
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          context,
          history: next.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.reply || data.error || "Не удалось получить ответ. Попробуйте позже.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Ошибка сети. Проверьте соединение." }]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "text-[#0b0e17] font-medium"
                  : "text-white/90"
              }`}
              style={
                m.role === "user"
                  ? { background: accentColor }
                  : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl px-4 py-2.5 text-sm text-white/60"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/10 flex gap-2 items-end">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder={placeholder}
          rows={1}
          className={`flex-1 resize-none rounded-xl px-3 py-2 bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 ${inputClassName}`}
          style={{ maxHeight: "100px" }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[#0b0e17] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          style={{ background: accentColor }}
          aria-label="Отправить"
        >
          <Icon name="Send" size={16} />
        </button>
      </div>
    </div>
  );
}
