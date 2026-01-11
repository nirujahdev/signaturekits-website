"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * CTA Section Component
 * Redesigned with luxury aesthetic, improved animations, and better visual hierarchy
 */
export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      // Reveal animation for quote with stagger
      gsap.fromTo(
        quoteRef.current,
        { 
          y: 80, 
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Reveal animation for button with delay
      gsap.fromTo(
        buttonRef.current,
        { 
          y: 40, 
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Parallax effect for background image
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          y: -80,
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // Overlay fade effect on scroll
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0.7,
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
      className="relative w-full bg-white overflow-hidden py-24 md:py-32 lg:py-40"
    >
      {/* Content Container */}
      <div className="container mx-auto px-4 md:px-6 lg:px-[60px] max-w-7xl">
        <div className="relative w-full mx-auto">
          {/* Image Container with Enhanced Styling */}
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">
            <Image
              ref={imageRef}
              src="/assests/cta.png"
              alt="Signature Kits CTA"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1400px"
              quality={90}
              loading="lazy"
              priority={false}
            />
            
            {/* Gradient Overlay */}
            <div 
              ref={overlayRef}
              className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"
            />
          </div>

          {/* Text Content - Centered with Better Spacing */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6 md:px-12 lg:px-16">
            <div className="text-center max-w-4xl space-y-8 md:space-y-10">
              <h2
                ref={quoteRef}
                className="font-display font-semibold text-white leading-[1.1] tracking-[-0.02em] drop-shadow-lg"
                style={{
                  fontSize: "clamp(40px, 7vw, 110px)",
                  textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                }}
              >
                Wear the timeless legacy
              </h2>
              
              {/* Enhanced Button with Better Styling */}
              <Link
                ref={buttonRef}
                href="/collections"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 md:px-14 md:py-6 backdrop-blur-lg bg-white/15 border-2 border-white/30 rounded-full text-white font-semibold text-base md:text-lg lg:text-xl tracking-tight hover:bg-white/25 hover:border-white/40 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105 active:scale-100"
              >
                <span>Explore Collections</span>
                <svg 
                  className="w-5 h-5 md:w-6 md:h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
