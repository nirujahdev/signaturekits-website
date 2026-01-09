"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { SearchBar } from '@/components/search/SearchBar';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = pathname === '/';
  const navItems = [
    { name: 'Shop', href: '/collections/clubs' },
    { name: 'About', href: '/about' },
    { name: 'Policies', href: '/policies' },
  ];

  // Force black text on subpages, transition on homepage
  const headerTextColor = (!isHomePage || isScrolled) ? 'text-black' : 'text-white';

  return (
    <header className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between h-[80px] px-8 md:px-[60px] transition-colors duration-500 bg-transparent">
        {/* Left: Brand */}
        <div className="flex items-center">
          <Link href="/" className={`font-display text-[24px] font-semibold tracking-tight ${headerTextColor} transition-colors duration-500`}>
            Signature Kits
          </Link>
        </div>

        {/* Center: Search with underline */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <div className="relative">
            <SearchBar />
            <div className={`absolute bottom-0 left-0 w-full h-[1px] ${headerTextColor === 'text-white' ? 'bg-white' : 'bg-black'} transition-colors duration-500`} />
          </div>
        </div>

        {/* Right: Menu + Cart */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-x-8">
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
          
          <Link href="/cart" className={`flex items-center gap-1.5 cursor-pointer group transition-all duration-300 ${headerTextColor} relative`}>
            <svg 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="w-[22px] h-[22px]"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
    </header>
  );
}
