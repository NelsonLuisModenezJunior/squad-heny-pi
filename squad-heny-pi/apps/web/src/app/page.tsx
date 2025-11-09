import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import ContentSection from "@/components/content-5";
import { ContentCarousel } from "@/components/content-carousel";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ContentCarousel />
      <ContentSection />
      <FooterSection />
    </div>
  );
}
