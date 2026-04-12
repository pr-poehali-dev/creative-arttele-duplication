import Icon from "@/components/ui/icon";

type Accent = "blue" | "green" | "purple";

interface PageHeroProps {
  badge: string;
  badgeIcon: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  accent?: Accent;
}

const accentConfig: Record<Accent, { color: string; rgb: string; gradient: string; gradientText: string }> = {
  blue: {
    color: "var(--neon-blue)",
    rgb: "0,212,255",
    gradient: "linear-gradient(135deg, var(--neon-blue), #60a5fa)",
    gradientText: "gradient-text-blue",
  },
  green: {
    color: "var(--neon-green)",
    rgb: "0,245,122",
    gradient: "linear-gradient(135deg, var(--neon-green), #34d399)",
    gradientText: "gradient-text-green",
  },
  purple: {
    color: "var(--neon-purple)",
    rgb: "168,85,247",
    gradient: "linear-gradient(135deg, var(--neon-purple), #c084fc)",
    gradientText: "gradient-text-purple",
  },
};

export default function PageHero({ badge, badgeIcon, title, highlight, subtitle, accent = "blue" }: PageHeroProps) {
  const cfg = accentConfig[accent];

  return (
    <div className="relative text-center mb-14 pt-4">
      {/* Ambient glow behind title */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(ellipse, rgba(${cfg.rgb},0.08) 0%, transparent 70%)`, filter: "blur(40px)" }}
      />

      {/* Badge */}
      <div className="slide-up inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
        style={{
          background: `rgba(${cfg.rgb},0.06)`,
          border: `1px solid rgba(${cfg.rgb},0.25)`,
          color: cfg.color,
        }}>
        <div className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: `rgba(${cfg.rgb},0.15)` }}>
          <Icon name={badgeIcon} size={11} color={cfg.color} />
        </div>
        <span className="text-xs font-black tracking-widest uppercase">{badge}</span>
      </div>

      {/* Title */}
      <h1 className="slide-up-delay-1 font-montserrat font-black leading-[1.05] mb-5"
        style={{ fontSize: "clamp(2.6rem, 7vw, 4.5rem)" }}>
        {highlight ? (
          <>
            <span className="text-white">{title}</span>
            {" "}
            <span
              style={{
                background: cfg.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              {highlight}
            </span>
          </>
        ) : (
          <span className="text-white">{title}</span>
        )}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="slide-up-delay-2 text-white/40 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Decorative line */}
      <div className="slide-up-delay-3 flex items-center justify-center gap-3 mt-7">
        <div className="h-px w-16 rounded-full" style={{ background: `linear-gradient(to right, transparent, rgba(${cfg.rgb},0.4))` }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color, boxShadow: `0 0 8px rgba(${cfg.rgb},0.8)` }} />
        <div className="h-px w-16 rounded-full" style={{ background: `linear-gradient(to left, transparent, rgba(${cfg.rgb},0.4))` }} />
      </div>
    </div>
  );
}
