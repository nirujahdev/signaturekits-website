"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = pathname === '/';
  const navItems = [
    { name: 'Product', href: '/product' },
    { name: 'News', href: '#' },
    { name: 'About +', href: '#' },
  ];

  // Force black text on subpages, transition on homepage
  const headerTextColor = (!isHomePage || isScrolled) ? 'text-black' : 'text-white';

  return (
    <header className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between h-[80px] px-8 md:px-[60px] transition-colors duration-500 bg-transparent">
        <div className="flex items-center">
          <Link href="/" className={`font-display text-[24px] font-semibold tracking-tight ${headerTextColor} transition-colors duration-500`}>
            Calder Co.
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-x-12">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-[15px] font-semibold tracking-[-0.01em] ${headerTextColor} transition-colors duration-500 hover:opacity-70`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          <Link href="#" className={`flex items-center gap-1.5 cursor-pointer group transition-all duration-300 ${headerTextColor}`}>
            <div className="relative">
              <svg 
                width="22" 
                height="22" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="w-[22px] h-[22px]"
              >
                <path d="M6 8V6a6 6 0 1 1 12 0v2" />
                <rect x="3" y="8" width="18" height="13" rx="2" />
              </svg>
            </div>
            <span className="text-[14px] font-bold tracking-tight mb-1">
              4
            </span>
          </Link>
        </div>
    </header>
  );
}
