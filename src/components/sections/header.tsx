"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { SearchBar } from '@/components/search/SearchBar';
import { CollectionsDropdown } from '@/components/CollectionsDropdown';
import { CartSidebar } from '@/components/CartSidebar';
import { MobileMenu } from '@/components/MobileMenu';
import { MobileSearchModal } from '@/components/MobileSearchModal';
import { Instagram, Menu, Search } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
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
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact-us' },
  ];

  // Force black text on subpages, transition on homepage
  const headerTextColor = (!isHomePage || isScrolled) ? 'text-black' : 'text-white';

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between h-[64px] md:h-[80px] px-4 md:px-8 lg:px-[60px] transition-colors duration-500 bg-transparent">
          {/* Left: Brand + Mobile Menu */}
          <div className="flex items-center gap-3 md:gap-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className={`w-6 h-6 ${headerTextColor} transition-colors duration-500`} />
            </button>
            <Link href="/" className={`font-display text-[20px] md:text-[24px] font-semibold tracking-tight ${headerTextColor} transition-colors duration-500`}>
              Signature Kits
            </Link>
          </div>

          {/* Center: Search with underline (Desktop only) */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="relative">
              <SearchBar />
              <div className={`absolute bottom-0 left-0 w-full h-[1px] ${headerTextColor === 'text-white' ? 'bg-white' : 'bg-black'} transition-colors duration-500`} />
            </div>
          </div>

          {/* Right: Search (Mobile) + Cart */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open search"
            >
              <Search className={`w-5 h-5 ${headerTextColor} transition-colors duration-500`} />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-x-8">
              {/* Collections with + icon */}
              <button
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                className={`text-[15px] font-semibold tracking-[-0.01em] ${headerTextColor} transition-colors duration-500 hover:opacity-70 flex items-center gap-1 min-h-[44px]`}
              >
                Collections
                <span className="text-[12px]">+</span>
              </button>
              
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-[15px] font-semibold tracking-[-0.01em] ${headerTextColor} transition-colors duration-500 hover:opacity-70 min-h-[44px] flex items-center`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Instagram Icon */}
              <a
                href="https://instagram.com/signaturekits.lk"
                target="_blank"
                rel="noopener noreferrer"
                className={`${headerTextColor} transition-colors duration-500 hover:opacity-70 min-w-[44px] min-h-[44px] flex items-center justify-center`}
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </nav>
            
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`flex items-center gap-1.5 cursor-pointer group transition-all duration-300 ${headerTextColor} relative min-w-[44px] min-h-[44px] justify-center`}
              aria-label="Open cart"
            >
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
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
      </header>
      
      {/* Collections Dropdown */}
      <CollectionsDropdown 
        isOpen={isCollectionsOpen} 
        onClose={() => setIsCollectionsOpen(false)}
        headerTextColor={headerTextColor}
      />
      
      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        headerTextColor={headerTextColor}
      />

      {/* Mobile Search Modal */}
      <MobileSearchModal
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />
    </>
  );
}
