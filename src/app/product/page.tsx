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
          {/* Luxury Hero Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-16 md:mb-20 gap-y-6 overflow-hidden">
            <h1 ref={titleRef} className="luxury-heading">
              All Products
            </h1>
            <p ref={descRef} className="luxury-body text-[16px] lg:text-[18px] lg:max-w-[400px] lg:text-right">
              Explore our complete collection of premium jerseys — from authentic replicas to custom embroidered pieces, designed for the ultimate fan experience.
            </p>
          </div>

          {/* Filters and Sorting - Luxury Style */}
          <div ref={filterRef} className="flex items-center gap-8 mb-12 pb-6 border-b border-[#E5E5E5]">
            <button className="flex items-center gap-2 luxury-uppercase text-[13px] font-semibold text-black hover:text-[#666666] transition-colors">
              <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
              Filter by <span className="text-[#666666] ml-1 font-normal">All</span>
            </button>
            <button className="flex items-center gap-2 luxury-uppercase text-[13px] font-semibold text-black hover:text-[#666666] transition-colors">
              <ArrowUpDown className="w-4 h-4" strokeWidth={2} />
              Sort by <span className="text-[#666666] ml-1 font-normal">Recommended</span>
            </button>
          </div>

          {/* Products Grid */}
          <div className="luxury-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
