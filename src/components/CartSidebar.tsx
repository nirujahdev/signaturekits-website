'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, loading, updateQuantity, removeItem, itemCount } = useCart();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  if (!mounted) return null;

  const content = (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[98]"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[99] shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Cart ({itemCount || 0})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-500">Loading...</div>
              </div>
            ) : !cart || cart.lines?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">Your cart is empty</p>
                <Link
                  href="/"
                  onClick={onClose}
                  className="text-sm text-gray-600 hover:text-black underline"
                >
                  Continue shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.lines.map((line: any) => (
                  <div
                    key={line.id}
                    className="flex gap-4 pb-4 border-b border-gray-100 last:border-0"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      {line.productVariant?.product?.featuredAsset?.preview ? (
                        <Image
                          src={line.productVariant.product.featuredAsset.preview}
                          alt={line.productVariant.product.name || 'Product'}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                        {line.productVariant?.product?.name || 'Product'}
                      </h3>
                      {line.productVariant?.name && (
                        <p className="text-xs text-gray-500 mb-2">
                          {line.productVariant.name}
                        </p>
                      )}

                      {/* Price */}
                      <div className="mb-3">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice((line.productVariant?.priceWithTax || 0) * (line.quantity || 1))}
                        </span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(line.id, (line.quantity || 1) - 1)}
                            disabled={line.quantity <= 1}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium text-gray-900">
                            {line.quantity || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(line.id, (line.quantity || 1) + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(line.id)}
                          className="ml-auto p-2 hover:bg-gray-100 rounded transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                          aria-label="Remove item"
                        >
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Subtotal & Checkout */}
          {cart && cart.lines?.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-base font-semibold text-gray-900">
                  {formatPrice(cart.totalWithTax || 0)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full bg-gray-900 text-white text-center py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors min-h-[52px] flex items-center justify-center"
              >
                Checkout
              </Link>
              <Link
                href="/"
                onClick={onClose}
                className="block text-center text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Continue shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}

