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
      startX: '50%',
      startY: '100%',
      endX: '50%',
      endY: '-20%',
      startScale: 0.7,
      endScale: 1.1,
      startRotate: 0,
      endRotate: -3,
      width: '30%',
      zIndex: 5,
    },
    {
      src: "https://framerusercontent.com/images/nt1dJn0IkDfh9mSMoRskezfk.png",
      startX: '-30%',
      startY: '60%',
      endX: '130%',
      endY: '-40%',
      startScale: 0.6,
      endScale: 1.2,
      startRotate: -8,
      endRotate: 8,
      width: '25%',
      zIndex: 6,
    },
    {
      src: "https://framerusercontent.com/images/lqLJkH7hoWgugSBvC6h8bR42Co.jpeg",
      startX: '130%',
      startY: '40%',
      endX: '-30%',
      endY: '-20%',
      startScale: 0.6,
      endScale: 1.2,
      startRotate: 8,
      endRotate: -8,
      width: '22%',
      zIndex: 6,
    },
    {
      src: "https://framerusercontent.com/images/c5HrCuSXzdDRWRqSWKKvSXWr0.png",
      startX: '50%',
      startY: '150%',
      endX: '50%',
      endY: '-50%',
      startScale: 0.5,
      endScale: 1.3,
      startRotate: 2,
      endRotate: -2,
      width: '35%',
      zIndex: 10,
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      // Set initial positions
      assets.forEach((asset, index) => {
        const img = imagesRef.current[index];
        if (img) {
          gsap.set(img, {
            x: asset.startX,
            y: asset.startY,
            scale: asset.startScale,
            rotation: asset.startRotate,
            transformOrigin: 'center center',
            opacity: 0.9,
          });
        }
      });

      // Create scroll-triggered animations for each image
      assets.forEach((asset, index) => {
        const img = imagesRef.current[index];
        if (!img) return;

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
          onUpdate: (self) => {
            const progress = self.progress;
            
            // Calculate current position based on scroll progress
            const currentX = gsap.utils.interpolate(asset.startX, asset.endX, progress);
            const currentY = gsap.utils.interpolate(asset.startY, asset.endY, progress);
            const currentScale = gsap.utils.interpolate(asset.startScale, asset.endScale, progress);
            const currentRotate = gsap.utils.interpolate(asset.startRotate, asset.endRotate, progress);
            
            gsap.set(img, {
              x: currentX,
              y: currentY,
              scale: currentScale,
              rotation: currentRotate,
            });
          },
        });
      });

      // Text animation - subtle scale and fade
      if (textRef.current) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const scale = gsap.utils.interpolate(1, 1.08, progress);
            const opacity = gsap.utils.interpolate(1, 0.7, progress);
            
            gsap.set(textRef.current, {
              scale,
              opacity,
            });
          },
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-white overflow-hidden"
      style={{ height: '400vh' }}
    >
      <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Title */}
        <div 
          ref={textRef}
          className="z-20 text-center px-4 pointer-events-none"
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
              width: asset.width,
              left: '50%',
              top: '50%',
              aspectRatio: '3/4',
              zIndex: asset.zIndex,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-lg shadow-2xl">
              <Image
                src={asset.src}
                alt={`Style editorial ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 30vw"
                quality={90}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StyleItYourWay;
