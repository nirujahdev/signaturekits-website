'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/data';
import { useParams } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Minus } from 'lucide-react';
import gsap from 'gsap';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find(p => p.id === id) || products[0];
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Medium');

  const infoRef = useRef<HTMLDivElement>(null);
  const imageStackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    
    tl.fromTo(imageStackRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, delay: 0.2 })
      .fromTo(infoRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0 }, "-=0.8");
  }, []);

  const sizes = ['Small', 'Medium', 'Large', 'Extra Large'];
  
  // Mock images for the stack - using different crops or similar images if available
  const images = [
    product.image,
    product.image, // In a real app these would be different
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Force header to be black on this page */}
      <Header />
      
      <main className="pt-[140px] pb-[80px]">
        <div className="container mx-auto px-6 md:px-[60px]">
          <div className="flex flex-col lg:flex-row gap-x-[120px]">
            {/* Left side: Image Stack */}
            <div ref={imageStackRef} className="flex-1 space-y-4 mb-10 lg:mb-0">
              {images.map((img, index) => (
                <div key={index} className="aspect-[4/5] relative bg-[#F5F5F5] overflow-hidden">
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {/* Right side: Product Info */}
            <div ref={infoRef} className="lg:w-[480px]">
              <div className="sticky top-[140px]">
                <span className="text-[14px] font-medium text-[#999999] tracking-wider uppercase mb-3 block">
                  {product.category || 'SHIRTS'}
                </span>
                <h1 className="text-[44px] font-semibold tracking-[-0.03em] leading-[1.05] text-black mb-6">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-12">
                  <span className="text-[24px] font-medium text-black">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[18px] text-[#BBBBBB] line-through font-normal">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Size Selector */}
                <div className="mb-12">
                  <div className="flex items-center gap-1 mb-4">
                    <span className="text-[14px] text-[#999999] font-medium uppercase tracking-tight">Size</span>
                    <span className="text-[14px] text-black font-semibold ml-1">{selectedSize}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`text-[15px] font-medium transition-all ${
                          selectedSize === size
                            ? 'text-black font-bold'
                            : 'text-[#999999] hover:text-black'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-[14px] text-[#666666] font-medium">
                    10 left in stock
                  </span>
                  <button className="text-[14px] font-medium text-[#999999] hover:text-black transition-colors">
                    Size Chart
                  </button>
                </div>

                {/* Add to Cart Controls */}
                <div className="flex gap-4 mb-12">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-[#E5E5E5] px-4 py-4 min-w-[140px] justify-between bg-[#FBFBFB]">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-[#999999] hover:text-black transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-[16px] font-semibold text-black">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-[#999999] hover:text-black transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button className="flex-1 bg-black text-white text-[16px] font-bold py-4 hover:bg-[#1A1A1A] transition-all transform active:scale-[0.98]">
                    Add to Cart
                  </button>
                </div>

                {/* Info Accordion */}
                <Accordion type="single" collapsible className="w-full border-t border-[#E5E5E5]">
                  <AccordionItem value="information" className="border-b border-[#E5E5E5]">
                    <AccordionTrigger className="text-[14px] font-semibold text-black uppercase tracking-widest py-6 hover:no-underline">
                      INFORMATION
                    </AccordionTrigger>
                    <AccordionContent className="text-[15px] leading-[1.7] text-[#666666] pb-6">
                      This classic regular-fit shirt is made from premium organic cotton, featuring a refined silhouette that works for both formal and casual settings. The fabric is treated for minimal wrinkling and maximum breathability.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="benefit" className="border-b border-[#E5E5E5]">
                    <AccordionTrigger className="text-[14px] font-semibold text-black uppercase tracking-widest py-6 hover:no-underline">
                      BENEFIT
                    </AccordionTrigger>
                    <AccordionContent className="text-[15px] leading-[1.7] text-[#666666] pb-6">
                      Designed with longevity in mind, this piece offers timeless appeal and exceptional comfort. The high-thread-count cotton ensures a soft hand-feel that only improves with age.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="payment" className="border-b border-[#E5E5E5]">
                    <AccordionTrigger className="text-[14px] font-semibold text-black uppercase tracking-widest py-6 hover:no-underline">
                      PAYMENT
                    </AccordionTrigger>
                    <AccordionContent className="text-[15px] leading-[1.7] text-[#666666] pb-6">
                      Secure checkout with support for major credit cards, Apple Pay, and Google Pay. Easy 30-day returns on all standard orders.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          {/* You May Also Like Section */}
          <section className="mt-[160px]">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-[80px] gap-y-10">
              <h2 className="text-[64px] lg:text-[100px] font-semibold tracking-[-0.05em] leading-[0.85] text-black">
                You May<br />Also Like
              </h2>
              <p className="text-[18px] font-medium text-[#666666] lg:max-w-[440px] leading-[1.5] tracking-tight">
                Discover timeless essentials curated just for you. These elevated basics blend comfort and sophistication — ideal additions to your everyday wardrobe.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[40px]">
              {products.slice(0, 3).map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  category={p.category}
                  price={p.price}
                  image={p.image}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
