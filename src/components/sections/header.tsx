"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { CollectionsDropdown } from '@/components/CollectionsDropdown';
import { CartSidebar } from '@/components/CartSidebar';
import { MobileMenu } from '@/components/MobileMenu';
import { Instagram, Menu } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();
  const collectionsTriggerRef = React.useRef<HTMLDivElement>(null);
  const collectionsCloseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
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
    { name: 'Contact', href: '/contact' },
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

          {/* Right: Cart */}
          <div className="flex items-center gap-3 md:gap-6">

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-x-8">
              {/* Collections with + icon - Hover to show dropdown, click to go to page */}
              <div
                ref={collectionsTriggerRef}
                className="relative"
                onMouseEnter={() => {
                  // Clear any pending close timeout
                  if (collectionsCloseTimeoutRef.current) {
                    clearTimeout(collectionsCloseTimeoutRef.current);
                    collectionsCloseTimeoutRef.current = null;
                  }
                  setIsCollectionsOpen(true);
                }}
                onMouseLeave={() => {
                  // Add a delay before closing to allow moving to dropdown
                  collectionsCloseTimeoutRef.current = setTimeout(() => {
                    setIsCollectionsOpen(false);
                  }, 300);
                }}
              >
                <Link
                  href="/collections"
                  className={`group relative text-[15px] font-semibold tracking-[-0.01em] ${headerTextColor} transition-colors duration-500 flex items-center gap-1 min-h-[44px]`}
                >
                  Collections
                  <span className="text-[12px]">+</span>
                  {/* Underline animation - extends beyond text width */}
                  <span className={`absolute bottom-0 left-[-4px] w-0 h-[2px] ${headerTextColor === 'text-white' ? 'bg-white' : 'bg-black'} group-hover:w-[calc(100%+8px)] transition-all duration-300 ease-out`} />
                </Link>
              </div>
              
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative text-[15px] font-semibold tracking-[-0.01em] ${headerTextColor} transition-colors duration-500 min-h-[44px] flex items-center`}
                  >
                    {item.name}
                    {/* Underline animation - extends beyond text width */}
                    <span className={`absolute bottom-0 left-[-4px] h-[2px] ${headerTextColor === 'text-white' ? 'bg-white' : 'bg-black'} transition-all duration-300 ease-out ${isActive ? 'w-[calc(100%+8px)]' : 'w-0 group-hover:w-[calc(100%+8px)]'}`} />
                  </Link>
                );
              })}

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
              onClick={() => {
                setIsCartOpen(true);
                setIsMobileMenuOpen(false); // Close mobile menu when cart opens
              }}
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
      
      {/* Collections Dropdown - Hover only */}
      <CollectionsDropdown 
        isOpen={isCollectionsOpen} 
        onClose={() => setIsCollectionsOpen(false)}
        headerTextColor={headerTextColor}
        triggerRef={collectionsTriggerRef}
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

    </>
  );
}
