"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * EverydayEssentials Component
 * 
 * A 4-column grid section showcasing main product categories.
 * Features:
 * - 2-column header layout (Title left, Description right)
 * - 4-column responsive grid (1-column mobile, 2-column tablet, 4-column desktop)
 * - Subtle scale hover effect on images
 * - Precise typography and spacing based on the design tokens
 */

const categories = [
  {
    title: 'Polo',
    image: 'https://framerusercontent.com/images/BjQfJy7nQoVxvCYTFzwZxprDWiQ.jpg',
    href: '/collection/polo',
  },
  {
    title: 'Shirts',
    image: 'https://framerusercontent.com/images/e9tQ6gSvJVVX5csWplfqNxX3T8.jpg',
    href: '/collection/shirts',
  },
  {
    title: 'Tee',
    image: 'https://framerusercontent.com/images/aEaVp0Cinm159R48O7MzEPPuUA.jpg',
    href: '/collection/tee',
  },
  {
    title: 'Jacket',
    image: 'https://framerusercontent.com/images/TzYNYizGo5wMkoLWobXEn6ye0.jpg',
    href: '/collection/jacket',
  },
];

const EverydayEssentials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.category-card', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.grid-container',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 bg-white py-[80px] md:py-[120px] lg:py-[160px]">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-[1440px]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-12 md:mb-16 lg:mb-24 gap-6 md:gap-12">
          <div className="w-full md:w-1/2">
            <h2 className="text-[40px] md:text-[56px] lg:text-[72px] font-medium leading-[1.1] tracking-[-0.02em] text-black">
              Everyday<br />Essentials
            </h2>
          </div>
          <div className="w-full md:w-[420px] lg:w-[480px]">
            <p className="text-[16px] md:text-[18px] leading-[1.6] text-[#666666] font-normal">
              Explore our best-selling categories — from crisp polos and refined shirts 
              to versatile jackets and relaxed-fit trousers, made to elevate your everyday wardrobe.
            </p>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-5">
          {categories.map((category) => (
            <a 
              key={category.title} 
              href={category.href} 
              className="category-card group block relative overflow-hidden"
            >
              {/* Image Container with Hover Effect */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F5]">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  priority={category.title === 'Polo'}
                />
              </div>
              
              {/* Label */}
              <div className="mt-4">
                <p className="text-[14px] font-semibold uppercase tracking-[0.05em] text-black transition-opacity duration-300">
                  {category.title}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EverydayEssentials;