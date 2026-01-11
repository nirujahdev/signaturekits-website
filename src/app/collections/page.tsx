'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import ProductList from '@/components/products/ProductList';
import { productOperations } from '@/lib/vendure-operations';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import gsap from 'gsap';

const collectionCategories = [
  { name: 'All Products', slug: '/product', href: '/product' },
  { name: 'Master Version', slug: 'master', href: '/collections/master' },
  { name: 'Player Version', slug: 'player-version', href: '/collections/player-version' },
  { name: 'Signature Embroidery', slug: 'custom-name-number', href: '/collections/custom-name-number' },
  { name: 'Retro', slug: 'retro', href: '/collections/retro' },
  { name: 'Sri Lanka Jerseys', slug: 'sri-lanka-jerseys', href: '/collections/sri-lanka-jerseys' },
  { name: 'Special Editions', slug: 'special-editions', href: '/collections/special-editions' },
];

export default function CollectionsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    
    tl.fromTo(titleRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, delay: 0.2 })
      .fromTo(descRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.7")
      .fromTo(filterRef.current, { opacity: 0 }, { opacity: 1 }, "-=0.5");

    loadAllProducts();
  }, []);

  const loadAllProducts = async () => {
    setLoading(true);
    try {
      const result = await productOperations.getProducts({ take: 50 });
      if (result?.products?.items) {
        setProducts(result.products.items);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-[100px] md:pt-[140px] pb-[60px] md:pb-[80px]">
        <div className="container mx-auto px-4 md:px-6 lg:px-[60px] max-w-7xl">
          {/* Category Navigation Bar - At Top */}
          <nav className="mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-4 md:gap-8 overflow-x-auto scrollbar-hide">
              {collectionCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.href}
                  className={`uppercase whitespace-nowrap transition-colors duration-300 pb-2 border-b-2 text-xs md:text-sm font-medium ${
                    cat.slug === '/product' || cat.slug === '/collections'
                      ? 'text-black border-black'
                      : 'text-[#666666] border-transparent hover:text-black hover:border-black/30'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-12 md:mb-16 gap-y-6">
            <h1 ref={titleRef} className="text-5xl md:text-6xl lg:text-7xl font-medium text-black leading-tight">
              Collections
            </h1>
            <p ref={descRef} className="text-base md:text-lg text-[#666666] lg:max-w-[500px] lg:text-right leading-relaxed">
              Explore our exquisite collection of jerseys, meticulously crafted for the discerning enthusiast. Each piece embodies a legacy of passion and precision.
            </p>
          </div>

          {/* Filters and Sorting */}
          <div ref={filterRef} className="flex items-center gap-4 md:gap-8 mb-8 md:mb-12 pb-4 md:pb-6 border-b border-[#E5E5E5]">
            <button className="flex items-center gap-2 uppercase text-xs md:text-sm font-semibold text-black hover:text-[#666666] transition-colors">
              <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
              Filter by <span className="text-[#666666] ml-1 font-normal">All</span>
            </button>
            <button className="flex items-center gap-2 uppercase text-xs md:text-sm font-semibold text-black hover:text-[#666666] transition-colors">
              <ArrowUpDown className="w-4 h-4" strokeWidth={2} />
              Sort by <span className="text-[#666666] ml-1 font-normal">Recommended</span>
            </button>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[4/5] rounded-lg" />
                  <div className="h-5 bg-gray-200 rounded mt-4 w-3/4" />
                  <div className="h-4 bg-gray-200 rounded mt-2 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <ProductList initialProducts={products} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

