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
      className="relative w-full bg-white overflow-hidden"
      style={{ minHeight: "80vh" }}
    >
      {/* Curved SVG Path */}
      <svg
        className="absolute top-0 left-0 w-full h-24 z-10"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        fill="white"
      >
        <path d="M0,100 C360,0 720,0 1080,0 C1260,0 1350,0 1440,0 L1440,100 L0,100 Z" />
      </svg>

      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
          <Image
            ref={imageRef}
            src="/assests/cta.png"
            alt="Signature Kits CTA"
            fill
            className="object-cover"
            sizes="100vw"
            quality={85}
            loading="lazy"
            unoptimized={false}
          />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-6 md:px-[60px] flex items-center justify-center min-h-[80vh]">
        <div className="text-center max-w-4xl">
          <h2
            ref={quoteRef}
            className="font-display font-semibold text-white leading-[1.1] tracking-[-0.02em]"
            style={{
              fontSize: "clamp(48px, 8vw, 120px)",
            }}
          >
            Wear the timeless legacy
          </h2>
        </div>
      </div>

      {/* Curved SVG Path Bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full h-24 z-10 rotate-180"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        fill="white"
      >
        <path d="M0,100 C360,0 720,0 1080,0 C1260,0 1350,0 1440,0 L1440,100 L0,100 Z" />
      </svg>
    </section>
  );
}

