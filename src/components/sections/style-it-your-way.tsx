"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StyleItYourWay = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);

  const assets = [
    {
      src: "https://framerusercontent.com/images/saF1SeA20CRqNd0546My02TzgEg.png",
      initial: { y: '100vh', x: '0%', scale: 0.8, rotate: 0 },
      animate: { y: '-120vh', x: '0%', scale: 1.1, rotate: -2 },
      style: { width: '30%', left: '35%', top: '50%' }
    },
    {
      src: "https://framerusercontent.com/images/nt1dJn0IkDfh9mSMoRskezfk.png",
      initial: { y: '20vh', x: '-120vw', scale: 0.8, rotate: -5 },
      animate: { y: '-80vh', x: '120vw', scale: 1.2, rotate: 5 },
      style: { width: '25%', left: '0%', top: '60%' }
    },
    {
      src: "https://framerusercontent.com/images/lqLJkH7hoWgugSBvC6h8bR42Co.jpeg",
      initial: { y: '40vh', x: '120vw', scale: 0.8, rotate: 5 },
      animate: { y: '-60vh', x: '-120vw', scale: 1.2, rotate: -5 },
      style: { width: '22%', right: '0%', top: '40%' }
    },
    {
      src: "https://framerusercontent.com/images/c5HrCuSXzdDRWRqSWKKvSXWr0.png",
      initial: { y: '150vh', x: '0%', scale: 0.8, rotate: 2 },
      animate: { y: '-250vh', x: '0%', scale: 1.3, rotate: -2 },
      style: { width: '35%', left: '32.5%', top: '50%' }
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        }
      });

      // Reset initial states
      assets.forEach((asset, index) => {
        const img = imagesRef.current[index];
        if (img) {
          gsap.set(img, {
            ...asset.initial,
            transformOrigin: 'center center'
          });
        }
      });

      // Animation sequence
      // 1. Image 1 comes from bottom center and goes through
      tl.to(imagesRef.current[0], {
        y: assets[0].animate.y,
        x: assets[0].animate.x,
        scale: assets[0].animate.scale,
        rotation: assets[0].animate.rotate,
        ease: 'none',
        duration: 1
      }, 0);

      // 2. Image 2 and 3 come from sides
      tl.to(imagesRef.current[1], {
        y: assets[1].animate.y,
        x: assets[1].animate.x,
        scale: assets[1].animate.scale,
        rotation: assets[1].animate.rotate,
        ease: 'none',
        duration: 1
      }, 0.3);

      tl.to(imagesRef.current[2], {
        y: assets[2].animate.y,
        x: assets[2].animate.x,
        scale: assets[2].animate.scale,
        rotation: assets[2].animate.rotate,
        ease: 'none',
        duration: 1
      }, 0.3);

      // 3. Last image comes from bottom and goes to next section
      tl.to(imagesRef.current[3], {
        y: assets[3].animate.y,
        x: assets[3].animate.x,
        scale: assets[3].animate.scale,
        rotation: assets[3].animate.rotate,
        ease: 'none',
        duration: 1.2
      }, 0.6);

      // Text subtle parallax or scale
      tl.to(textRef.current, {
        scale: 1.05,
        opacity: 0.8,
        ease: 'none',
        duration: 1.5
      }, 0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-white overflow-hidden"
      style={{ height: '500vh' }}
    >
      <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Title */}
        <div 
          ref={textRef}
          className="z-10 text-center px-4 pointer-events-none"
        >
          <h2 className="font-display text-[14vw] md:text-[12vw] font-medium leading-[0.85] tracking-tight text-black">
            Style It<br />Your Way
          </h2>
        </div>

        {/* Floating Images */}
        {assets.map((asset, index) => (
          <div
            key={index}
            ref={el => { imagesRef.current[index] = el; }}
            className="absolute"
            style={{
              ...asset.style,
              aspectRatio: '3/4',
              zIndex: index === 3 ? 20 : 5 // Last image on top
            }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-md shadow-2xl">
              <Image
                src={asset.src}
                alt={`Style editorial ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 30vw"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StyleItYourWay;