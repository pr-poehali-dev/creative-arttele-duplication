import Navbar from "@/components/Navbar";
import VideoHeroSection from "@/components/video/VideoHeroSection";
import VideoServicesSection from "@/components/video/VideoServicesSection";
import VideoCameraGrid from "@/components/video/VideoCameraGrid";
import VideoPackagesSection from "@/components/video/VideoPackagesSection";

export default function VideoSurveillancePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--dark-bg)" }}>
      <Navbar />
      <VideoHeroSection />
      <VideoServicesSection />
      <VideoCameraGrid />
      <VideoPackagesSection />
    </div>
  );
}