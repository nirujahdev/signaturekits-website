import { Metadata } from 'next';
import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import IconicKitsHotspotSlider from "@/components/IconicKitsHotspotSlider";
import EverydayEssentials from "@/components/sections/everyday-essentials";
import ProvenFavorites from "@/components/sections/proven-favorites";
import StyleItYourWay from "@/components/sections/style-it-your-way";
import Benefits from "@/components/sections/benefits";
import NewsGrid from "@/components/sections/news-grid";
import CTASection from "@/components/sections/cta-section";
import Footer from "@/components/sections/footer";
import { generatePageMetadata } from '@/lib/generate-metadata';
import { OrganizationStructuredData } from '@/components/seo/StructuredData';
import { FAQStructuredData } from '@/components/seo/StructuredData';
import { FAQSection } from '@/components/seo/FAQSection';
import { DirectAnswer } from '@/components/seo/DirectAnswer';
import { HOMEPAGE_CONTENT } from '@/lib/seo-content';

export const metadata: Metadata = generatePageMetadata({
  title: HOMEPAGE_CONTENT.title,
  description: HOMEPAGE_CONTENT.description,
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
      <FAQStructuredData faqs={HOMEPAGE_CONTENT.faqs} />
      <main className="min-h-screen bg-white">
        <Header />
        <Hero />
        {/* AEO Direct Answer Block */}
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <DirectAnswer
              deliveryDays="10–20"
              hasCustomization={true}
              hasCOD={true}
              isPreOrder={true}
            />
          </div>
        </div>
        <EverydayEssentials />
        <ProvenFavorites />
        <StyleItYourWay />
        <Benefits />
        <NewsGrid />
        <CTASection />
        <div className="container mx-auto px-6 py-12">
          <FAQSection faqs={HOMEPAGE_CONTENT.faqs} title="Frequently Asked Questions" />
        </div>
        <Footer />
      </main>
    </>
  );
}
