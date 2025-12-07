import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import ContentSection from "@/components/content-5";
import { HeroHeader } from "@/components/header";
import { ContentCarousel } from "@/components/content-carousel";

export default function Home() {
  return (
    <div>
      <HeroHeader />
      <HeroSection />
      <ContentCarousel />
      <ContentSection />
      <FooterSection />
    </div>
  );
}
