'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Instagram, ChevronDown } from 'lucide-react';
import { CollectionsDropdown } from '@/components/CollectionsDropdown';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  headerTextColor: string;
}

export function MobileMenu({ isOpen, onClose, headerTextColor }: MobileMenuProps) {
  const [mounted, setMounted] = React.useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Close menu when route changes
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!mounted) return null;

  const navItems = [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact-us' },
  ];

  const content = (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[98] transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Menu Drawer */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white z-[99] shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <nav className="flex flex-col space-y-1">
              {/* Collections */}
              <div className="relative">
                <button
                  onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                  className="w-full flex items-center justify-between py-4 text-left text-base font-semibold text-gray-900 hover:text-gray-700 transition-colors min-h-[44px]"
                  aria-expanded={isCollectionsOpen}
                  aria-label="Toggle collections menu"
                >
                  <span>Collections</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                      isCollectionsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Collections Dropdown Content */}
                {isCollectionsOpen && (
                  <div className="pl-4 pb-4 space-y-1">
                    <Link
                      href="/collections/club-jerseys"
                      onClick={onClose}
                      className="block py-3 text-[15px] font-medium text-gray-700 hover:text-gray-900 transition-colors min-h-[44px] flex items-center"
                    >
                      Club Jerseys
                    </Link>
                    <Link
                      href="/collections/national-teams"
                      onClick={onClose}
                      className="block py-3 text-[15px] font-medium text-gray-700 hover:text-gray-900 transition-colors min-h-[44px] flex items-center"
                    >
                      National Teams
                    </Link>
                    <Link
                      href="/collections/retro"
                      onClick={onClose}
                      className="block py-3 text-[15px] font-medium text-gray-700 hover:text-gray-900 transition-colors min-h-[44px] flex items-center"
                    >
                      Retro
                    </Link>
                    <Link
                      href="/collections/kids"
                      onClick={onClose}
                      className="block py-3 text-[15px] font-medium text-gray-700 hover:text-gray-900 transition-colors min-h-[44px] flex items-center"
                    >
                      Kids
                    </Link>
                  </div>
                )}
              </div>

              {/* Other Nav Items */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="py-4 text-base font-semibold text-gray-900 hover:text-gray-700 transition-colors min-h-[44px] flex items-center"
                >
                  {item.name}
                </Link>
              ))}

              {/* Instagram */}
              <a
                href="https://instagram.com/signaturekits.lk"
                target="_blank"
                rel="noopener noreferrer"
                className="py-4 text-base font-semibold text-gray-900 hover:text-gray-700 transition-colors min-h-[44px] flex items-center gap-2"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
                <span>Instagram</span>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}

