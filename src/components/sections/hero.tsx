"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero Section Component
 * Featuring a full-width background image with parallax and GSAP reveal animations.
 * Headline: Signature Kits
 * Subtext: Timeless Wardrobe. Everyday Power.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Reveal Animation for Headline and Subheadline
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1.5 },
      });

      tl.fromTo(
        headlineRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, delay: 0.5 }
      ).fromTo(
        subheadlineRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1 },
        "-=1.2"
      );

        // 2. Scroll-in effect (Shrink/Reveal)
        // This matches the effect where the image container shrinks slightly and gets rounded corners as you scroll
        if (bgImageRef.current && sectionRef.current) {
          const wrapper = bgImageRef.current.parentElement;
          
          // Pin the section so the next one overlaps it
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            pin: true,
            pinSpacing: false,
            scrub: 1.5,
          });

          gsap.to(wrapper, {
            scale: 0.9,
            borderRadius: "40px",
            opacity: 0.8,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.5,
            },
          });

          gsap.to(bgImageRef.current, {
            scale: 1.15,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100vh] min-h-[500px] md:min-h-[600px] flex items-end bg-white"
    >
      {/* Background Image Wrapper */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <div className="relative w-full h-full overflow-hidden origin-center">
          <Image
            ref={bgImageRef}
            src="/assests/herosection_img.png"
            alt="Signature Kits Hero"
            fill
            priority
            loading="eager"
            className="object-cover scale-100"
            sizes="100vw"
            quality={90}
            unoptimized={false}
          />
          {/* Light Overlay */}
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        </div>
      </div>

      {/* Hero Content Container */}
      <div className="container relative z-10 w-full flex flex-col md:flex-row items-end justify-between pb-8 md:pb-12 lg:pb-20 text-white px-4 md:px-6">
        {/* Large Left Branding - Bottom Left Overlay */}
        <div className="w-full md:w-auto mb-6 md:mb-0 relative z-10">
          <h1
            ref={headlineRef}
            className="font-display font-semibold select-none leading-[0.85] md:leading-[0.8] mix-blend-difference"
            style={{
              fontSize: "clamp(48px, 10vw, 140px)",
              letterSpacing: "-0.04em",
              color: "#FFFFFF",
            }}
          >
            Signature Kits
          </h1>
        </div>

        {/* Subtext Paragraph - Bottom Right */}
        <div className="w-full md:w-auto md:max-w-xs text-left md:text-right relative z-10">
          <p
            ref={subheadlineRef}
            className="font-sans font-normal leading-[1.3] md:leading-[1.2] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            style={{
              fontSize: "clamp(18px, 4vw, 32px)",
              letterSpacing: "-0.02em",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            Timeless Wardrobe.
            <br />
            Everyday Power.
          </p>
        </div>
      </div>
      
      {/* Scroll indicator or bottom edge treatment */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10" />
    </section>
  );
}