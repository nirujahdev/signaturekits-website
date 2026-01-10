import { Metadata } from 'next';
import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import EverydayEssentials from "@/components/sections/everyday-essentials";
import ProvenFavorites from "@/components/sections/proven-favorites";
import StyleItYourWay from "@/components/sections/style-it-your-way";
import Benefits from "@/components/sections/benefits";
import NewsGrid from "@/components/sections/news-grid";
import CTASection from "@/components/sections/cta-section";
import Footer from "@/components/sections/footer";
import { generatePageMetadata } from '@/lib/generate-metadata';
import { OrganizationStructuredData } from '@/components/seo/StructuredData';
import { DEFAULT_CATEGORY_FAQS } from '@/lib/seo';
import { FAQStructuredData } from '@/components/seo/StructuredData';
import { FAQSection } from '@/components/seo/FAQSection';

export const metadata: Metadata = generatePageMetadata({
  title: 'Football Jerseys Sri Lanka | Premium Club & National Team Kits – Signature Kits',
  description: 'Shop premium football jerseys in Sri Lanka: club kits, national teams, retro, and special editions. Pre-orders available. Islandwide delivery + easy size guide. Add name & number. COD available.',
  path: '/',
});

export default function Home() {
  return (
    <>
      <OrganizationStructuredData
        name="Signature Kits"
        url="https://signaturekits-website.vercel.app"
        logo="https://signaturekits-website.vercel.app/logo.png"
      />
      <FAQStructuredData faqs={DEFAULT_CATEGORY_FAQS} />
      <main className="min-h-screen bg-white">
        <Header />
        <Hero />
        <EverydayEssentials />
        <ProvenFavorites />
        <StyleItYourWay />
        <Benefits />
        <NewsGrid />
        <CTASection />
        <div className="container mx-auto px-6 py-12">
          <FAQSection faqs={DEFAULT_CATEGORY_FAQS} />
        </div>
        <Footer />
      </main>
    </>
  );
}
