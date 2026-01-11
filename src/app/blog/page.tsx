import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[100px] md:pt-[140px] pb-[80px]">
        <div className="container mx-auto px-4 md:px-6 lg:px-[60px] max-w-7xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-black leading-tight mb-12 md:mb-16">
            Blog
          </h1>

          <div className="prose max-w-none">
            <p className="text-base md:text-lg text-[#666666] leading-relaxed mb-12">
              Stay updated with the latest news, style tips, and stories from Signature Kits.
            </p>

            <div className="text-center py-16">
              <p className="text-lg text-[#999999]">Blog posts coming soon.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

