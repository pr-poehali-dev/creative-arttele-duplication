import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Tab, CloudUser, navItems, mockCameras } from "./constants";

interface CloudSidebarProps {
  tab: Tab;
  setTab: (t: Tab) => void;
  user: CloudUser;
  onLogout: () => void;
}

export default function CloudSidebar({ tab, setTab, user, onLogout }: CloudSidebarProps) {
  const onlineCams = mockCameras.filter((c) => c.status === "online").length;

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 flex-shrink-0"
      style={{ background: "#0b0d18", borderRight: "1px solid rgba(255,255,255,0.05)" }}>

      {/* Logo */}
      <div className="p-6 mb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Link to="/video/cloud" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-green))" }}>
            <Icon name="Eye" size={16} color="#0b0e17" />
          </div>
          <span className="font-black text-white text-sm">CloudVideo</span>
        </Link>
      </div>

      {/* Status chip */}
      <div className="mx-4 mb-6 px-4 py-3 rounded-xl" style={{ background: "rgba(0,245,122,0.07)", border: "1px solid rgba(0,245,122,0.15)" }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00f57a" }} />
          <span className="text-xs font-bold" style={{ color: "var(--neon-green)" }}>Система активна</span>
        </div>
        <p className="text-white/30 text-xs">{onlineCams} из {mockCameras.length} камер онлайн</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setTab(item.id)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left"
            style={tab === item.id
              ? { background: "rgba(0,212,255,0.1)", color: "var(--neon-blue)", border: "1px solid rgba(0,212,255,0.2)" }
              : { color: "rgba(255,255,255,0.4)", border: "1px solid transparent" }}>
            <Icon name={item.icon} size={17} color={tab === item.id ? "var(--neon-blue)" : "rgba(255,255,255,0.3)"} />
            {item.label}
            {item.id === "alerts" && (
              <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-black"
                style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444" }}>3</span>
            )}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 m-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))", color: "white" }}>
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold truncate">{user.name}</p>
            <p className="text-white/30 text-xs">Тариф {user.plan === "pro" ? "Про" : user.plan}</p>
          </div>
          <button onClick={onLogout} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <Icon name="LogOut" size={15} color="rgba(255,255,255,0.4)" />
          </button>
        </div>
      </div>
    </aside>
  );
}
