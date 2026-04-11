import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Icon from "@/components/ui/icon";

interface HlsPlayerProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function HlsPlayer({ src, className, style }: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setError(false);
    setLoading(true);

    if (Hls.isSupported()) {
      const hls = new Hls({ lowLatencyMode: true });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) setError(true);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        setLoading(false);
        video.play().catch(() => {});
      });
      video.addEventListener("error", () => setError(true));
    } else {
      setError(true);
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [src]);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-black/60 ${className}`} style={style}>
        <Icon name="WifiOff" size={28} color="#ffffff55" />
        <span className="text-white/30 text-xs font-mono">Нет сигнала</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        autoPlay
        playsInline
        loop
      />
    </div>
  );
}
