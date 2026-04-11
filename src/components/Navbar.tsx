import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";

const navLinks = [
  { label: "Главная",    href: "/" },
  { label: "Тарифы",     href: "/tariffs" },
  { label: "О компании", href: "/about" },
  { label: "Блог",       href: "/blog" },
  { label: "FAQ",        href: "/faq" },
  { label: "Контакты",   href: "/contacts" },
];

interface NavbarProps {
  onLkOpen?: () => void;
}

export default function Navbar({ onLkOpen }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--neon-blue)] to-[var(--neon-green)] flex items-center justify-center">
            <Icon name="Wifi" size={16} className="text-[#0b0e17]" />
          </div>
          <span className="font-montserrat font-black text-xl tracking-tight">
            <span style={{ color: "var(--neon-blue)" }}>Связь</span>
            <span className="text-white">Про</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === link.href
                  ? "text-[#00d4ff] bg-[rgba(0,212,255,0.1)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLkOpen}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm neon-glow-btn text-[#0b0e17]"
            style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}
          >
            <Icon name="User" size={15} />
            Личный кабинет
          </button>
          <button className="lg:hidden text-white/70 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-white/5 bg-[#0b0e17]/95 px-6 py-4 flex flex-col gap-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                location.pathname === link.href
                  ? "text-[#00d4ff] bg-[rgba(0,212,255,0.1)]"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { onLkOpen?.(); setMenuOpen(false); }}
            className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[#0b0e17] font-bold text-sm"
            style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}
          >
            <Icon name="User" size={15} /> Личный кабинет
          </button>
        </div>
      )}
    </nav>
  );
}
