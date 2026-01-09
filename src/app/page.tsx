import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import EverydayEssentials from "@/components/sections/everyday-essentials";
import ProvenFavorites from "@/components/sections/proven-favorites";
import StyleItYourWay from "@/components/sections/style-it-your-way";
import Benefits from "@/components/sections/benefits";
import NewsGrid from "@/components/sections/news-grid";
import CTASection from "@/components/sections/cta-section";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <EverydayEssentials />
      <ProvenFavorites />
      <StyleItYourWay />
      <Benefits />
      <NewsGrid />
      <CTASection />
      <Footer />
    </main>
  );
}
