"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * CTA Section Component
 * Curved/wavy design with background image and quote "Wear the timeless legacy"
 */
export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animation for quote
      gsap.fromTo(
        quoteRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Parallax effect for background image
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white overflow-hidden py-[120px] md:py-[160px]"
    >
      {/* Content Container with Rectangle Image */}
      <div className="container mx-auto px-6 md:px-[60px]">
        <div className="relative w-full max-w-6xl mx-auto">
          {/* Rectangle Image with Curved Edges */}
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[40px] md:rounded-[60px]">
            <Image
              ref={imageRef}
              src="/assests/cta.png"
              alt="Signature Kits CTA"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              quality={85}
              loading="lazy"
              unoptimized={false}
            />
            {/* Darker Overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Text Content - Right Aligned */}
          <div className="absolute inset-0 flex items-center justify-end pr-8 md:pr-16 z-20">
            <div className="text-right max-w-2xl">
              <h2
                ref={quoteRef}
                className="font-display font-semibold text-white leading-[1.1] tracking-[-0.02em]"
                style={{
                  fontSize: "clamp(36px, 6vw, 96px)",
                }}
              >
                Wear the timeless legacy
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

