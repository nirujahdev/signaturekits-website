'use client';

import React, { useEffect, useRef } from 'react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/data';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import gsap from 'gsap';

export default function ProductsPage() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    
    tl.fromTo(titleRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, delay: 0.2 })
      .fromTo(descRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.7")
      .fromTo(filterRef.current, { opacity: 0 }, { opacity: 1 }, "-=0.5");
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-[140px] pb-[80px]">
        <div className="container mx-auto px-10 md:px-[40px]">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-[80px] gap-y-6 overflow-hidden">
            <h1 ref={titleRef} className="text-[64px] lg:text-[100px] font-semibold tracking-[-0.04em] leading-[0.9] text-black">
              All Products
            </h1>
            <p ref={descRef} className="text-[16px] lg:text-[18px] font-medium text-[#666666] lg:max-w-[400px] lg:text-right leading-[1.4] tracking-tight">
              From crisp polos to everyday jeans — explore the full range of modern menswear designed for comfort, style, and movement.
            </p>
          </div>

          {/* Filters and Sorting */}
          <div ref={filterRef} className="flex items-center gap-x-8 mb-[48px] border-b border-[#E5E5E5] pb-6">
            <button className="flex items-center gap-2 text-[14px] font-semibold text-black uppercase tracking-wider">
              <SlidersHorizontal className="w-4 h-4" strokeWidth={2.5} />
              Filter by <span className="text-[#666666] ml-1">All</span>
            </button>
            <button className="flex items-center gap-2 text-[14px] font-semibold text-black uppercase tracking-wider">
              <ArrowUpDown className="w-4 h-4" strokeWidth={2.5} />
              Sort by <span className="text-[#666666] ml-1">Default</span>
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[32px] gap-y-[64px]">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
