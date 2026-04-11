import background from "@/data/background";

export default function PageBackground() {
  if (background.type === "image" && background.src) {
    return (
      <>
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${background.src})` }}
        />
        <div
          className="fixed inset-0 -z-10"
          style={{ background: `rgba(11,14,23,${background.overlay})` }}
        />
      </>
    );
  }

  if (background.type === "video" && background.src) {
    return (
      <>
        <video
          className="fixed inset-0 -z-10 w-full h-full object-cover"
          src={background.src}
          autoPlay
          loop
          muted
          playsInline
        />
        <div
          className="fixed inset-0 -z-10"
          style={{ background: `rgba(11,14,23,${background.overlay})` }}
        />
      </>
    );
  }

  // type === "gradient" — стандартный фон из CSS
  return null;
}
