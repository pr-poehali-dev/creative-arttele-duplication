import Icon from "@/components/ui/icon";
import { CloudCamera } from "./constants";

interface CloudFullscreenModalProps {
  fullscreenCam: CloudCamera | null;
  setFullscreenCam: (c: CloudCamera | null) => void;
}

export default function CloudFullscreenModal({ fullscreenCam, setFullscreenCam }: CloudFullscreenModalProps) {
  if (!fullscreenCam) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}
      onClick={() => setFullscreenCam(null)}>
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden" onClick={(e) => e.stopPropagation()}
        style={{ border: "1px solid rgba(0,212,255,0.2)" }}>
        <div className="flex items-center justify-between px-5 py-3"
          style={{ background: "#0d0f1a", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#ef4444" }} />
            <span className="text-white/60 text-sm font-mono">{fullscreenCam.name}</span>
          </div>
          <button onClick={() => setFullscreenCam(null)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <Icon name="X" size={18} color="rgba(255,255,255,0.5)" />
          </button>
        </div>
        <div className="relative" style={{ aspectRatio: "16/9", background: "#0a0c14" }}>
          <iframe src={fullscreenCam.iframe!} className="absolute inset-0 w-full h-full" style={{ border: "none" }} allow="autoplay; fullscreen" allowFullScreen />
        </div>
      </div>
    </div>
  );
}
