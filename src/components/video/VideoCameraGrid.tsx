import { useState } from "react";
import Icon from "@/components/ui/icon";
import HlsPlayer from "@/components/HlsPlayer";

const cameras = [
  { label: "Вход • Камера 1", iframe: "https://vkvideo.ru/video_ext.php?oid=-104158648&id=456239679&hash=", color: "#00d4ff" },
  { label: "Парковка • Камера 2", iframe: "https://vkvideo.ru/video_ext.php?oid=-105329382&id=456240514&hd=2&autoplay=1", color: "#00f57a" },
  { label: "Склад • Камера 3", stream: "https://test-streams.mux.dev/test_001/stream.m3u8", color: "#00d4ff" },
  { label: "Офис • Камера 4", stream: "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8", color: "#a855f7" },
];

export default function VideoCameraGrid() {
  const [fullscreenCam, setFullscreenCam] = useState<number | null>(null);

  return (
    <>
      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-4 tracking-widest uppercase"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.35)",
                color: "#ef4444",
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#ef4444" }} />
              Live — мониторинг объектов
            </div>
            <h2 className="text-2xl lg:text-4xl font-black text-white">
              Пример интерфейса видеонаблюдения
            </h2>
          </div>

          <div
            className="rounded-3xl overflow-hidden p-4"
            style={{
              background: "#0a0c14",
              border: "1px solid rgba(0,212,255,0.2)",
              boxShadow: "0 0 60px rgba(0,212,255,0.1)",
            }}
          >
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#ef4444" }} />
                <span className="text-white/50 text-xs font-mono">REC • 4 камеры активны</span>
              </div>
              <span className="text-white/30 text-xs font-mono">
                {new Date().toLocaleDateString("ru-RU")} 24/7
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cameras.map((cam, i) => (
                <div
                  key={cam.label}
                  className="relative rounded-xl overflow-hidden cursor-pointer group"
                  style={{ aspectRatio: "16/9" }}
                  onClick={() => setFullscreenCam(i)}
                >
                  {cam.iframe ? (
                    <iframe src={cam.iframe} className="absolute inset-0 w-full h-full" style={{ border: "none" }} allow="autoplay; fullscreen" allowFullScreen />
                  ) : (
                    <HlsPlayer src={cam.stream!} className="absolute inset-0 w-full h-full" />
                  )}
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)" }} />
                  {!cam.iframe && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: "rgba(0,0,0,0.35)" }}>
                      <Icon name="Maximize2" size={28} color="white" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl" style={{ borderColor: cam.color }} />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr" style={{ borderColor: cam.color }} />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl" style={{ borderColor: cam.color }} />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br" style={{ borderColor: cam.color }} />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#ef4444" }} />
                    <span className="text-white/80 text-xs font-mono">{cam.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-white/30 text-xs mt-4">
            Демонстрационный режим — пример интерфейса мониторинга
          </p>
        </div>
      </section>

      {fullscreenCam !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
          onClick={() => setFullscreenCam(null)}
        >
          <div
            className="relative w-full max-w-5xl mx-4 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ border: `1px solid ${cameras[fullscreenCam].color}55`, boxShadow: `0 0 80px ${cameras[fullscreenCam].color}30` }}
          >
            <div className="flex items-center justify-between px-4 py-3" style={{ background: "#0a0c14", borderBottom: `1px solid ${cameras[fullscreenCam].color}33` }}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#ef4444" }} />
                <span className="text-white/70 text-sm font-mono">{cameras[fullscreenCam].label}</span>
              </div>
              <button
                onClick={() => setFullscreenCam(null)}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-white/10"
              >
                <Icon name="X" size={18} color="white" />
              </button>
            </div>

            <div className="relative" style={{ aspectRatio: "16/9" }}>
              {cameras[fullscreenCam].iframe ? (
                <iframe src={cameras[fullscreenCam].iframe} className="absolute inset-0 w-full h-full" style={{ border: "none" }} allow="autoplay; fullscreen" allowFullScreen />
              ) : (
                <HlsPlayer src={cameras[fullscreenCam].stream!} className="absolute inset-0 w-full h-full" />
              )}
              <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)" }} />
              {["top-4 left-4 border-t-2 border-l-2 rounded-tl", "top-4 right-4 border-t-2 border-r-2 rounded-tr", "bottom-4 left-4 border-b-2 border-l-2 rounded-bl", "bottom-4 right-4 border-b-2 border-r-2 rounded-br"].map((cls) => (
                <div key={cls} className={`absolute w-6 h-6 ${cls}`} style={{ borderColor: cameras[fullscreenCam].color }} />
              ))}
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-white/20"
                style={{ background: "rgba(0,0,0,0.5)" }}
                onClick={() => setFullscreenCam((fullscreenCam - 1 + cameras.length) % cameras.length)}
              >
                <Icon name="ChevronLeft" size={22} color="white" />
              </button>
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-white/20"
                style={{ background: "rgba(0,0,0,0.5)" }}
                onClick={() => setFullscreenCam((fullscreenCam + 1) % cameras.length)}
              >
                <Icon name="ChevronRight" size={22} color="white" />
              </button>
            </div>

            <div className="flex gap-2 p-3" style={{ background: "#0a0c14" }}>
              {cameras.map((cam, i) => (
                <div
                  key={cam.label}
                  className="relative flex-1 rounded-lg overflow-hidden cursor-pointer transition-all"
                  style={{ aspectRatio: "16/9", opacity: i === fullscreenCam ? 1 : 0.45, border: i === fullscreenCam ? `1px solid ${cam.color}` : "1px solid transparent" }}
                  onClick={() => setFullscreenCam(i)}
                >
                  <HlsPlayer src={cam.stream} className="absolute inset-0 w-full h-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}