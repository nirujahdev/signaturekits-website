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

  return (
    <Link href={`/product/${id}`} className="group block">
      <div ref={cardRef} className="flex flex-col space-y-4">
        <div className="aspect-[4/5] overflow-hidden bg-[#F5F5F5] relative">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-black uppercase lg:normal-case">
              {name}
            </h3>
            <span className="text-[12px] font-medium text-[#666666] tracking-wider mt-1 uppercase">
              {category}
            </span>
          </div>
          <span className="text-[16px] font-medium text-black">
            ${price.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
