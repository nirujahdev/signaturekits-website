'use client';

import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    title: 'Master Version',
    image: '/assests/master version.png',
    href: '/collections/master',
  },
  {
    title: 'Player Version',
    image: '/assests/player version.png',
    href: '/collections/player',
  },
  {
    title: 'Signature Embroidery',
    image: '/assests/Signature Emboriery.png',
    href: '/collections/embroidery',
  },
  {
    title: 'Retro',
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

    // Use a small delay to ensure the DOM is ready
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const content = (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]"
        style={{ top: '80px' }}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dropdown Menu */}
      <div
        ref={dropdownRef}
        className="fixed left-0 w-full bg-white z-[95] border-b border-gray-200 shadow-lg"
        style={{ top: '80px' }}
      >
        <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-[1440px] py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {categories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                onClick={onClose}
                className="group block"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F5] rounded-[30px] md:rounded-[40px] mb-4">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    quality={85}
                  />
                </div>
                <p className="text-[16px] md:text-[18px] font-semibold uppercase tracking-[0.05em] text-black text-center">
                  {category.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // Use portal to render outside the header component
  return createPortal(content, document.body);
}

