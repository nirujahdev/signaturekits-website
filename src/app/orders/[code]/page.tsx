'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { orderOperations } from '@/lib/vendure-operations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import Image from 'next/image';

interface OrderLine {
  id: string;
  quantity: number;
  unitPriceWithTax: number;
  linePriceWithTax: number;
  productVariant: {
    id: string;
    name: string;
    sku: string;
    product: {
      id: string;
      name: string;
      slug: string;
      featuredAsset?: {
        preview: string;
      };
    };
  };
  customFields?: {
    patchEnabled?: boolean;
    patchType?: string;
    printName?: string;
    printNumber?: string;
  };
}

interface Order {
  id: string;
  code: string;
  state: string;
  totalWithTax: number;
  currencyCode: string;
  orderPlacedAt: string;
  lines: OrderLine[];
  shippingAddress?: {
    fullName: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province?: string;
    postalCode: string;
    countryCode: string;
    phoneNumber?: string;
  };
  customFields?: {
    phoneNumber?: string;
    phoneVerified?: boolean;
  };
}

const ORDER_STATE_MAP: Record<string, { label: string; icon: any; color: string }> = {
  AddingItems: { label: 'Draft', icon: Clock, color: 'text-gray-500' },
  ArrangingPayment: { label: 'Payment Pending', icon: Clock, color: 'text-yellow-500' },
  PaymentAuthorized: { label: 'Payment Authorized', icon: CheckCircle2, color: 'text-blue-500' },
  PaymentSettled: { label: 'Payment Settled', icon: CheckCircle2, color: 'text-green-500' },
  PartiallyFulfilled: { label: 'Partially Shipped', icon: Truck, color: 'text-blue-500' },
  Fulfilled: { label: 'Shipped', icon: Truck, color: 'text-blue-500' },
  Cancelled: { label: 'Cancelled', icon: Package, color: 'text-red-500' },
};

export default function OrderTrackingPage() {
  const { code } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderCodeInput, setOrderCodeInput] = useState(code as string || '');

  useEffect(() => {
    if (code) {
      loadOrder(code as string);
    }
  }, [code]);

  const loadOrder = async (orderCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await orderOperations.getOrderByCode(orderCode);
      if (result?.orderByCode) {
        setOrder(result.orderByCode);
      } else {
        setError('Order not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderCodeInput) {
      router.push(`/orders/${orderCodeInput}`);
    }
  };

  const formatPrice = (price: number, currency: string = 'LKR') => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-LK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const orderState = order ? ORDER_STATE_MAP[order.state] || {
    label: order.state,
    icon: Package,
    color: 'text-gray-500',
  } : null;

  if (!code) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-6 py-20 max-w-2xl">
          <h1 className="text-4xl font-semibold mb-8">Track Your Order</h1>
          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label htmlFor="orderCode" className="block text-sm font-medium mb-2">
                Order Code
              </label>
              <Input
                id="orderCode"
                type="text"
                placeholder="Enter your order code"
                value={orderCodeInput}
                onChange={(e) => setOrderCodeInput(e.target.value.toUpperCase())}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Track Order
            </Button>
          </form>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-6 py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-6 py-20 max-w-2xl">
          <div className="text-center">
            <h1 className="text-4xl font-semibold mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The order you are looking for does not exist.'}</p>
            <form onSubmit={handleLookup} className="space-y-4 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Enter order code"
                value={orderCodeInput}
                onChange={(e) => setOrderCodeInput(e.target.value.toUpperCase())}
                required
              />
              <Button type="submit" className="w-full">Lookup Order</Button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const StateIcon = orderState?.icon || Package;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold mb-2">Order {order.code}</h1>
          <p className="text-gray-600">Placed on {formatDate(order.orderPlacedAt)}</p>
        </div>

        {/* Order Status */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <StateIcon className={`w-8 h-8 ${orderState?.color || 'text-gray-500'}`} />
            <div>
              <h2 className="text-xl font-semibold">Order Status</h2>
              <p className={`text-lg ${orderState?.color || 'text-gray-500'}`}>
                {orderState?.label || order.state}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.lines.map((line) => (
              <div key={line.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
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
                  <h3 className="font-semibold mb-1">{line.productVariant.product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {line.productVariant.name} × {line.quantity}
                  </p>
                  {line.customFields && (
                    <div className="text-xs text-gray-600">
                      {line.customFields.patchEnabled && (
                        <span>Patch: {line.customFields.patchType}</span>
                      )}
                      {line.customFields.printName && (
                        <span className="ml-2">Name: {line.customFields.printName}</span>
                      )}
                      {line.customFields.printNumber && (
                        <span className="ml-2">#{line.customFields.printNumber}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="font-semibold">
                  {formatPrice(line.linePriceWithTax, order.currencyCode)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.streetLine1}</p>
              {order.shippingAddress.streetLine2 && <p>{order.shippingAddress.streetLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              {order.shippingAddress.phoneNumber && (
                <p className="mt-2">Phone: {order.shippingAddress.phoneNumber}</p>
              )}
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(order.totalWithTax, order.currencyCode)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-4 border-t">
              <span>Total</span>
              <span>{formatPrice(order.totalWithTax, order.currencyCode)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Timeline */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold mb-2">Expected Delivery</h3>
          <p className="text-sm text-gray-700">
            Pre-order items typically ship within 15-20 days. You will receive tracking information
            once your order has been dispatched.
          </p>
        </div>

        <div className="mt-8">
          <Button onClick={() => router.push('/')} variant="outline">
            Continue Shopping
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

