import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { FAQSection } from '@/components/seo/FAQSection';
import { HOMEPAGE_CONTENT } from '@/lib/seo-content';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[100px] md:pt-[140px] pb-[80px]">
        <div className="container mx-auto px-4 md:px-6 lg:px-[60px] max-w-7xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-black leading-tight mb-12 md:mb-16">
            Frequently Asked Questions
          </h1>

          <div className="prose max-w-none">
            <p className="text-base md:text-lg text-[#666666] leading-relaxed mb-12">
              Find answers to common questions about our products, shipping, returns, and more.
            </p>

            <FAQSection faqs={HOMEPAGE_CONTENT.faqs} title="" showStructuredData={false} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

