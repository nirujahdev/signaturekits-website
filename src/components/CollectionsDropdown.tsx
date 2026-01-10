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
      {/* Backdrop with smooth fade */}
      <div 
        className={`fixed inset-0 bg-black/5 z-[90] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ top: '80px' }}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dropdown Menu - Smooth, clean design */}
      <div
        ref={dropdownRef}
        className={`fixed left-0 w-full bg-white z-[95] border-b border-gray-100 transition-all duration-300 ease-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
        style={{ top: '80px' }}
      >
        <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-[1200px] py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {categories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                onClick={onClose}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-lg mb-3 transition-all duration-300 ease-out group-hover:shadow-lg group-hover:scale-[1.02]">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    quality={90}
                  />
                </div>
                <p className="text-sm md:text-base font-medium text-gray-700 text-center group-hover:text-black transition-colors duration-200">
                  {category.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}

