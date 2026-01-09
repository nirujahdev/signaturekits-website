import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-[80px] pb-[120px]">
        <div className="container mx-auto px-6 md:px-[60px] max-w-4xl">
          <h1 className="text-[64px] md:text-[80px] font-semibold tracking-[-0.02em] leading-[1.1] text-black mb-12">
            About Signature Kits
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-[18px] leading-[1.6] text-[#666666] mb-8">
              Signature Kits is your premier destination for authentic and premium jerseys. 
              We specialize in bringing you the finest collection of club, country, retro, 
              and current jerseys for both adults and kids.
            </p>
            
            <p className="text-[18px] leading-[1.6] text-[#666666] mb-8">
              Our commitment is to deliver quality craftsmanship and timeless designs that 
              celebrate the legacy of football. Every jersey tells a story, and we're here 
              to help you wear that legacy with pride.
            </p>
            
            <p className="text-[18px] leading-[1.6] text-[#666666]">
              From master versions to player editions, signature embroidery to retro classics, 
              Signature Kits offers customization options including name and number printing, 
              as well as patch add-ons to make your jersey truly unique.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

