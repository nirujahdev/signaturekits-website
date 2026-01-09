'use client';

import { useCart } from '@/contexts/CartContext';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-6 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-6 py-20">
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h1 className="text-3xl font-semibold mb-4">Your cart is empty</h1>
            <p className="text-gray-500 mb-8">Add some jerseys to get started!</p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: cart.currencyCode || 'LKR',
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.lines.map((line) => (
              <div
                key={line.id}
                className="flex gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="relative w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {line.productVariant.product.featuredAsset?.preview && (
                    <Image
                      src={line.productVariant.product.featuredAsset.preview}
                      alt={line.productVariant.product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold mb-1">
                    {line.productVariant.product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {line.productVariant.name} • {line.productVariant.sku}
                  </p>

                  {/* Customization Display */}
                  {line.customFields && (
                    <div className="text-xs text-gray-600 mb-2">
                      {line.customFields.patchEnabled && (
                        <span>Patch: {line.customFields.patchType || 'Yes'}</span>
                      )}
                      {line.customFields.printName && (
                        <span className="ml-2">
                          Name: {line.customFields.printName}
                        </span>
                      )}
                      {line.customFields.printNumber && (
                        <span className="ml-2">
                          #{line.customFields.printNumber}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(line.id, line.quantity - 1)}
                        disabled={line.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {line.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-semibold">
                        {formatPrice((line.productVariant.priceWithTax || 0) * line.quantity)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(line.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.totalWithTax || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(cart.totalWithTax || 0)}</span>
                </div>
              </div>

              <Link href="/checkout" className="block">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/" className="block mt-4">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

