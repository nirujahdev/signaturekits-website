'use client';

import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    title: 'Master Version',
    description: 'Authentic replica jerseys',
    image: '/assests/master version.png',
    href: '/collections/master',
  },
  {
    title: 'Player Version',
    description: 'Match-worn specifications',
    image: '/assests/player version.png',
    href: '/collections/player',
  },
  {
    title: 'Signature Embroidery',
    description: 'Custom name & number',
    image: '/assests/Signature Emboriery.png',
    href: '/collections/embroidery',
  },
  {
    title: 'Retro',
    description: 'Vintage classics',
    image: '/assests/retro.png',
    href: '/collections/retro',
  },
];

interface CollectionsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  headerTextColor: string;
}

export function CollectionsDropdown({ isOpen, onClose }: CollectionsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const content = (
    <>
      {/* Elegant backdrop */}
      <div 
        className={`fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[90] transition-opacity duration-500 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ top: '80px' }}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Luxury Dropdown Menu */}
      <div
        ref={dropdownRef}
        className={`fixed left-0 w-full bg-white z-[95] border-b border-[#E5E5E5] transition-all duration-500 ease-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        style={{ top: '80px' }}
      >
        <div className="container mx-auto px-8 md:px-16 lg:px-24 max-w-[1600px] py-16 md:py-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 lg:gap-20">
            {categories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                onClick={onClose}
                className="group block focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4 rounded-lg p-3 -m-3 transition-all duration-300"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#FAFAFA] mb-6 transition-all duration-700 ease-out group-hover:shadow-2xl group-hover:shadow-black/5 group-hover:-translate-y-2">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                    quality={95}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 group-hover:from-black/0 group-hover:via-black/0 group-hover:to-black/5 transition-all duration-500" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-[15px] md:text-[16px] font-semibold text-black tracking-[0.02em] uppercase letter-spacing-wide group-hover:text-black transition-colors duration-300">
                    {category.title}
                  </h3>
                  {category.description && (
                    <p className="text-[12px] md:text-[13px] font-normal text-[#666666] tracking-[0.01em] leading-relaxed group-hover:text-[#333333] transition-colors duration-300">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}

