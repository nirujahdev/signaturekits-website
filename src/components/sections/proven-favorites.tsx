"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { productOperations } from '@/lib/vendure-operations';

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: string;
  name: string;
  slug: string;
  featuredAsset?: {
    preview: string;
  };
  assets?: Array<{
    preview: string;
  }>;
  variants: Array<{
    id: string;
    priceWithTax: number;
    currencyCode: string;
  }>;
}

const ProvenFavorites = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from('.product-card', {
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [products]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await productOperations.getProducts({ take: 3 });
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
    <section ref={sectionRef} className="bg-white editorial-spacing">
      <div className="container">
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 mb-[80px] items-start">
          <div className="md:col-span-6">
            <h2 className="font-h2 text-black">
              Proven<br />Favorites
            </h2>
          </div>
          <div className="md:col-span-6 md:pl-[80px] mt-6 md:mt-0">
            <p className="text-[18px] leading-[1.6] text-[#666666] max-w-[440px]">
              Trusted by thousands of customers. These pieces define versatility — perfect for workdays or weekends.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-[#f5f5f5] rounded-sm" />
                <div className="mt-6 space-y-2">
                  <div className="h-4 bg-[#f5f5f5] rounded w-3/4" />
                  <div className="h-3 bg-[#f5f5f5] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product, index) => {
              const variant = product.variants?.[0];
              const price = variant?.priceWithTax || 0;
              const mainImage = product.featuredAsset?.preview || product.assets?.[0]?.preview || '/placeholder-jersey.jpg';
              const secondaryImage = product.assets?.[1]?.preview || mainImage;

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug || product.id}`}
                  className="product-card group flex flex-col no-underline"
                >
                  {/* Image Container with Hover Transition */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f5]">
                    {/* Primary Image */}
                    <div className="absolute inset-0 transition-opacity duration-500 ease-in-out group-hover:opacity-0">
                      <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={index === 0}
                      />
                    </div>
                    {/* Secondary Image (if available) */}
                    {secondaryImage !== mainImage && (
                      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">
                        <Image
                          src={secondaryImage}
                          alt={`${product.name} Alternate View`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="mt-6 flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-[16px] font-medium leading-[1.2] text-black tracking-tight">
                        {product.name}
                      </h3>
                      <span className="label-uppercase text-[#666666]">
                        JERSEY
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="label-uppercase mr-0.5">LKR</span>
                      <span className="label-uppercase">{(price / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#666666]">No products available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProvenFavorites;