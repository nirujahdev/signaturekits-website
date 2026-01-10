'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearchModal({ isOpen, onClose }: MobileSearchModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      onClose();
    }
  };

  if (!mounted) return null;

  const content = (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[98] transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Search Modal */}
      <div
        className={`fixed inset-0 z-[99] transform transition-all duration-300 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Search</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close search"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Search Form */}
          <div className="flex-1 flex items-start justify-center pt-12 px-6">
            <form onSubmit={handleSubmit} className="w-full max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Search jerseys..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0 w-full min-h-[52px]"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors min-h-[52px]"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}

