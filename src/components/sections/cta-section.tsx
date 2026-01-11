"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * CTA Section Component
 * Clean centered design with dark overlay and glass effect button
 */
export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
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

      // Reveal animation for button
      gsap.fromTo(
        buttonRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          delay: 0.3,
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
            <div className="absolute inset-0 bg-black/60" />
          </div>

          {/* Text Content - Centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6 md:px-12">
            <div className="text-center max-w-3xl">
              <h2
                ref={quoteRef}
                className="font-display font-semibold text-white leading-[1.1] tracking-[-0.02em] mb-8"
                style={{
                  fontSize: "clamp(36px, 6vw, 96px)",
                }}
              >
                Wear the timeless legacy
              </h2>
              
              {/* Glass Effect Button */}
              <Link
                ref={buttonRef}
                href="/collections"
                className="inline-block px-8 py-4 md:px-12 md:py-5 backdrop-blur-md bg-white/10 border border-white/20 rounded-full text-white font-semibold text-base md:text-lg tracking-tight hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explore Collections
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

