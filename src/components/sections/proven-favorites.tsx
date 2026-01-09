"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: 1,
    title: 'Relaxed Linen Jacket',
    category: 'JACKET',
    price: '69.00',
    slug: 'relaxed-linen-jacket',
    image1: 'https://framerusercontent.com/images/vY2nUwZAsphGUDKa3rdmuqv6MA.jpg',
    image2: 'https://framerusercontent.com/images/Neip3ZTwRypwsMNwPKSfzaC46c.jpg',
  },
  {
    id: 2,
    title: 'Basic Regular Fit Tee',
    category: 'TEE',
    price: '19.00',
    slug: 'black-tee',
    image1: 'https://framerusercontent.com/images/CvrAfdHz2Yl0nez9qiIYtvqGI.jpg',
    image2: 'https://framerusercontent.com/images/7paF1t6YnNBWcop0OmGOItAo0E.jpg',
  },
  {
    id: 3,
    title: 'Baggy Denim Trousers',
    category: 'PANTS',
    price: '49.00',
    slug: 'basic-wax-jeans',
    image1: 'https://framerusercontent.com/images/1t6cW6ncZSmwsl7y12j21hXs.jpg',
    image2: 'https://framerusercontent.com/images/bgGp6e4hKOrnCZnSgB3gYKmj9GI.jpg',
  },
];

const ProvenFavorites = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <a
              key={product.id}
              href={`/product/${product.slug}`}
              className="product-card group flex flex-col no-underline"
            >
              {/* Image Container with Hover Transition */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f5]">
                {/* Primary Image */}
                <div className="absolute inset-0 transition-opacity duration-500 ease-in-out group-hover:opacity-0">
                  <Image
                    src={product.image1}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={product.id === 1}
                  />
                </div>
                {/* Secondary Image (Back View) */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">
                  <Image
                    src={product.image2}
                    alt={`${product.title} Alternate View`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-6 flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <h3 className="text-[16px] font-medium leading-[1.2] text-black tracking-tight">
                    {product.title}
                  </h3>
                  <span className="label-uppercase text-[#666666]">
                    {product.category}
                  </span>
                </div>
                <div className="flex items-baseline">
                  <span className="label-uppercase mr-0.5">$</span>
                  <span className="label-uppercase">{product.price}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProvenFavorites;