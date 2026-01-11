import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import IconicKitsHotspotSlider from "@/components/IconicKitsHotspotSlider";
import EverydayEssentials from "@/components/sections/everyday-essentials";
import ProvenFavorites from "@/components/sections/proven-favorites";
import Benefits from "@/components/sections/benefits";
import Footer from "@/components/sections/footer";
import { generatePageMetadata } from '@/lib/generate-metadata';
import { DirectAnswer } from '@/components/seo/DirectAnswer';
import { HOMEPAGE_CONTENT } from '@/lib/seo-content';

// Dynamically import FAQSection to avoid static generation issues
const FAQSection = dynamic(() => import('@/components/seo/FAQSection').then(mod => ({ default: mod.FAQSection })));

export const metadata: Metadata = generatePageMetadata({
  title: HOMEPAGE_CONTENT.title,
  description: HOMEPAGE_CONTENT.description,
  path: '/',
});

export default function Home() {
  // Inline structured data to avoid import issues
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Signature Kits',
    url: 'https://signaturekits-website.vercel.app',
    logo: {
      '@type': 'ImageObject',
      url: 'https://signaturekits-website.vercel.app/logo.png',
    },
  };

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOMEPAGE_CONTENT.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <main className="min-h-screen bg-white">
        <Header />
        <Hero />
        {/* AEO Direct Answer Block */}
        <div className="container mx-auto px-4 md:px-6 lg:px-[60px] max-w-7xl py-8">
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
        <IconicKitsHotspotSlider />
        <Benefits />
        <div className="container mx-auto px-4 md:px-6 lg:px-[60px] max-w-7xl py-12">
          <FAQSection faqs={HOMEPAGE_CONTENT.faqs} title="Frequently Asked Questions" showStructuredData={false} />
        </div>
        <Footer />
      </main>
    </>
  );
}
