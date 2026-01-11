import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[100px] md:pt-[140px] pb-[80px]">
        <div className="container mx-auto px-4 md:px-6 lg:px-[60px] max-w-7xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-black leading-tight mb-12 md:mb-16">
            About Signature Kits
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-base md:text-lg text-[#666666] leading-relaxed mb-8">
              Signature Kits is your premier destination for authentic and premium jerseys. 
              We specialize in bringing you the finest collection of club, country, retro, 
              and current jerseys for both adults and kids.
            </p>
            
            <p className="text-base md:text-lg text-[#666666] leading-relaxed mb-8">
              Our commitment is to deliver quality craftsmanship and timeless designs that 
              celebrate the legacy of football. Every jersey tells a story, and we're here 
              to help you wear that legacy with pride.
            </p>
            
            <p className="text-base md:text-lg text-[#666666] leading-relaxed">
              From master versions to player editions, signature embroidery to retro classics, 
              Signature Kits offers customization options including name and number printing, 
              as well as patch add-ons to make your jersey truly unique.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

