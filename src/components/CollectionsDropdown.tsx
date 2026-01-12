'use client';

import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    title: 'All',
    href: '/collections',
    image: '/assests/collections dropdown menu/Master Version.png',
  },
  {
    title: 'Master Version',
    href: '/collections/master',
    image: '/assests/collections dropdown menu/Master Version.png',
  },
  {
    title: 'Player Version',
    href: '/collections/player-version',
    image: '/assests/collections dropdown menu/Player version.png',
  },
  {
    title: 'Retro',
    href: '/collections/retro',
    image: '/assests/collections dropdown menu/Retro.png',
  },
  {
    title: 'Signature Embroidery',
    href: '/collections/custom-name-number',
    image: '/assests/collections dropdown menu/Signature Embroidery.png',
  },
];

interface CollectionsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  headerTextColor: string;
  triggerRef?: React.RefObject<HTMLElement>;
}

export function CollectionsDropdown({ isOpen, onClose, headerTextColor, triggerRef }: CollectionsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !triggerRef?.current) return;

    const updatePosition = () => {
      if (triggerRef?.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 8,
          left: rect.left,
        });
      }
    };

    updatePosition();
    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();
    
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, triggerRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const content = (
    <div
      ref={dropdownRef}
      onMouseEnter={() => {}} // Keep open on hover
      onMouseLeave={onClose}
      className="fixed bg-white z-[95] border border-[#E5E5E5] shadow-xl transition-all duration-300 ease-out rounded-lg overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        minWidth: '200px',
        animation: isOpen ? 'fadeInSlideDown 0.3s ease-out forwards' : 'none',
      }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Menu Items */}
        <div className="py-2">
          {categories.map((category, index) => (
            <Link
              key={category.title}
              href={category.href}
              onClick={onClose}
              onMouseEnter={() => setHoveredItem(category.title)}
              onMouseLeave={() => setHoveredItem(null)}
              className="group relative flex items-center px-6 py-3 text-[15px] font-medium text-black hover:bg-gray-50 transition-all duration-200 min-w-[200px] transform hover:translate-x-1"
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
            >
              <span className="relative">
                {category.title}
                {/* Underline animation */}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black group-hover:w-full transition-all duration-300 ease-out" />
              </span>
            </Link>
          ))}
        </div>

        {/* Image Preview */}
        {hoveredItem && (
          <div 
            className="border-l border-[#E5E5E5] p-4 bg-gray-50 transition-all duration-300 ease-out"
            style={{
              animation: 'fadeInSlideRight 0.3s ease-out forwards',
            }}
          >
            {(() => {
              const category = categories.find((cat) => cat.title === hoveredItem);
              if (!category) return null;
              return (
                <div className="relative w-[200px] h-[250px] overflow-hidden rounded-lg bg-[#FAFAFA] shadow-md">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out hover:scale-110"
                    sizes="200px"
                    quality={90}
                  />
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
