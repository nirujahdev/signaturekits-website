import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headset } from 'lucide-react';

/**
 * Benefits Bar Section
 * Clones the trust items: Free shipping, hassle-free returns, product warranty, 24/7 support.
 * Uses the Plus Jakarta Sans font and layout constraints defined in the High-Level Design.
 */

const benefits = [
  {
    icon: <Truck size={20} strokeWidth={1.5} />,
    text: "Free shipping on orders over $75",
  },
  {
    icon: <RotateCcw size={20} strokeWidth={1.5} />,
    text: "14-day hassle-free returns",
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    text: "30-day product warranty",
  },
  {
    icon: <Headset size={20} strokeWidth={1.5} />,
    text: "Customer support 24/7",
  },
];

const Benefits = () => {
  return (
    <section 
      className="w-full bg-white border-y border-[#E5E5E5]"
      data-framer-name="Section: Benefit"
    >
      <div className="container max-w-[1440px] mx-auto px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-4 py-8 md:py-10 
                ${index !== benefits.length - 1 ? 'lg:border-r lg:border-[#E5E5E5]' : ''}
                ${index % 2 === 0 ? 'md:border-r lg:border-r' : 'md:border-r-0 lg:border-r'}
                ${index < 2 ? 'border-b md:border-b lg:border-b-0' : 'border-b md:border-b-0'}
                border-[#E5E5E5] last:border-b-0 md:[&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r
                flex-1 px-4 md:px-8 first:pl-0 last:pr-0
              `}
            >
              <div 
                className="text-black flex-shrink-0"
                style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {benefit.icon}
              </div>
              <p 
                className="text-[14px] md:text-[15px] font-medium leading-tight text-black tracking-tight"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {benefit.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;