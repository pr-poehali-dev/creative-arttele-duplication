import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const stats = [
  { value: "500+", label: "Объектов сдано" },
  { value: "8 лет", label: "На рынке" },
  { value: "24/7", label: "Техподдержка" },
  { value: "1 день", label: "Срок монтажа" },
];

export default function VideoHeroSection() {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden">
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

          <Link
            to="/video/cloud"
            className="mt-6 flex items-center gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5 group"
            style={{
              background: "linear-gradient(135deg, rgba(0,245,122,0.07), rgba(0,212,255,0.05))",
              border: "1px solid rgba(0,245,122,0.2)",
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(0,245,122,0.12)" }}>
              <Icon name="Cloud" size={20} color="var(--neon-green)" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">Облачное видеонаблюдение</p>
              <p className="text-white/40 text-xs">Подключи камеры онлайн — без монтажа, от 490 ₽/мес</p>
            </div>
            <Icon name="ArrowRight" size={18} color="rgba(0,245,122,0.5)" />
          </Link>

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
  );
}