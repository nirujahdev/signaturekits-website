"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * StyleShowcase Component
 * 
 * A dynamic scroll-triggered section "Style It Your Way" that features multiple 
 * layered images with motion blur and parallax effects that shift positions 
 * as the user scrolls, creating a high-fashion editorial feel.
 */
export default function StyleShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress for the entire section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth springs for natural movement
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax transforms for the 4 editorial images
  // Image 1 (Top Left area, larger)
  const y1 = useTransform(smoothProgress, [0, 1], [0, -150]);
  const blur1 = useTransform(smoothProgress, [0, 0.5, 1], ["blur(0px)", "blur(4px)", "blur(0px)"]);
  
  // Image 2 (Higher Center-Right)
  const y2 = useTransform(smoothProgress, [0, 1], [100, -250]);
  const scale2 = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.1, 1]);
  
  // Image 3 (Lower Left-Center)
  const y3 = useTransform(smoothProgress, [0, 1], [-50, -400]);
  
  // Image 4 (Far Bottom Right)
  const y4 = useTransform(smoothProgress, [0, 1], [200, -350]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-white overflow-hidden pb-[120px] md:pb-[240px]"
      style={{ minHeight: "180vh" }}
    >
      <div className="container mx-auto px-8 md:px-10 h-full">
        <div className="flex flex-col md:flex-row relative h-full pt-[120px]">
          
          {/* Sticky Heading Container */}
          <div className="w-full md:w-[40%] mb-20 md:mb-0">
            <div className="sticky top-[120px] z-10">
              <h2 className="font-h2 text-black leading-[1.1] tracking-[-0.02em]">
                Style It<br />Your Way
              </h2>
            </div>
          </div>

          {/* Masonry-style Parallax Image Gallery */}
          <div className="relative w-full md:w-[60%] h-full flex flex-col gap-[200px] md:gap-0">
            
            {/* Image 1 - Top Leftish */}
            <motion.div 
              style={{ y: y1, filter: blur1 }}
              className="relative w-[300px] h-[400px] md:w-[464px] md:h-[616px] md:ml-[10%] z-2"
            >
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/849c97f8-d51a-4b1d-ac0a-b06fa1212cb1-calder-co-framer-website/assets/images/saF1SeA20CRqNd0546My02TzgEg-13.png"
                alt="Editorial Style Showcase 1"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 300px, 464px"
              />
            </motion.div>

            {/* Image 2 - Offset Right */}
            <motion.div 
              style={{ y: y2, scale: scale2 }}
              className="relative self-end w-[250px] h-[330px] md:w-[452px] md:h-[600px] md:mt-[-100px] md:mr-[-10%] z-3"
            >
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/849c97f8-d51a-4b1d-ac0a-b06fa1212cb1-calder-co-framer-website/assets/images/nt1dJn0IkDfh9mSMoRskezfk-14.png"
                alt="Editorial Style Showcase 2"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 250px, 452px"
              />
            </motion.div>

            {/* Image 3 - Lower Left */}
            <motion.div 
              style={{ y: y3 }}
              className="relative w-[280px] h-[370px] md:w-[448px] md:h-[594px] md:ml-[-15%] md:mt-[-50px] z-1"
            >
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/849c97f8-d51a-4b1d-ac0a-b06fa1212cb1-calder-co-framer-website/assets/images/lqLJkH7hoWgugSBvC6h8bR42Co-15.jpeg"
                alt="Editorial Style Showcase 3"
                fill
                className="object-cover grayscale"
                sizes="(max-width: 768px) 280px, 448px"
              />
            </motion.div>

            {/* Image 4 - Far Bottom Right */}
            <motion.div 
              style={{ y: y4 }}
              className="relative self-end w-[320px] h-[480px] md:w-[500px] md:h-[750px] md:mt-[100px] md:mr-[-5%] z-4"
            >
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/849c97f8-d51a-4b1d-ac0a-b06fa1212cb1-calder-co-framer-website/assets/images/c5HrCuSXzdDRWRqSWKKvSXWr0-16.png"
                alt="Editorial Style Showcase 4"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 320px, 500px"
              />
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}