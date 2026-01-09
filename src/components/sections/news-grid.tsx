"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const newsItems = [
  {
    image: "https://framerusercontent.com/images/bCP8Y525q8MRGEodLwNKSbfHsU.png",
    title: "Spring 2025 Essentials",
    description: "Polos and relaxed tailoring for the new season.",
  },
  {
    image: "https://framerusercontent.com/images/NkZ9k6uRpPcNT5ljAL7N4HwgeBI.png",
    title: "Signature Kits Pop-up Experience",
    description: "A temporary space dedicated to craftsmanship.",
  },
  {
    image: "https://framerusercontent.com/images/N9UYlXmlamX4XHzGah5iI3CBKg.png",
    title: "Responsible Fabric & Design",
    description: "Our sourcing process, from field to form.",
  },
];

const NewsGrid = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.news-card', {
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
    <section ref={sectionRef} className="editorial-spacing bg-white">
      <div className="container">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
          <div className="max-w-[600px]">
            <h2 className="font-h2 text-black mb-4">
              What&apos;s New at<br />
              Signature Kits
            </h2>
          </div>
          <div className="md:pt-4 max-w-[320px] ml-auto overflow-hidden">
            <p className="text-[14px] text-[#666666] leading-[1.4] text-right font-medium">
              From new product drops to style tips — read our latest features, editorials, and brand announcements.
            </p>
          </div>
        </div>

        {/* Grid Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
          {newsItems.map((item, index) => (
            <div key={index} className="news-card group cursor-pointer flex flex-col">
              {/* Image Container */}
              <div className="aspect-[4/5] overflow-hidden mb-6 relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Text Content */}
              <div className="flex flex-col">
                <h3 className="text-[18px] font-semibold text-black mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[14px] text-[#666666] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Fine Border Style Simulation */}
              <div className="mt-6 pt-6 border-t border-[#e5e5e5] flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="label-uppercase text-[12px]">Read Article</span>
                <span className="text-[18px]">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .editorial-spacing {
          padding-top: 160px;
          padding-bottom: 160px;
        }
        @media (max-width: 768px) {
          .editorial-spacing {
            padding-top: 80px;
            padding-bottom: 80px;
          }
        }
      `}</style>
    </section>
  );
};

export default NewsGrid;