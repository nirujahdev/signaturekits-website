'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

export default function ProductCard({ id, name, category, price, image }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(cardRef.current, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, []);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Link href={`/product/${id}`} className="group block luxury-product-card">
      <div ref={cardRef} className="flex flex-col space-y-5">
        <div className="aspect-[4/5] overflow-hidden bg-[#FAFAFA] relative">
          <Image
            src={image}
            alt={`${name} jersey`}
            fill
            className="object-cover luxury-image-zoom"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors duration-500" />
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col space-y-1">
            <h3 className="text-[15px] font-medium tracking-[0.02em] text-black uppercase leading-tight">
              {name}
            </h3>
            <span className="text-[11px] font-normal text-[#666666] tracking-[0.08em] uppercase">
              {category}
            </span>
          </div>
          <span className="text-[15px] font-medium text-black tracking-tight">
            {formatPrice(price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
