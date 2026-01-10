'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { DirectAnswer } from '@/components/seo/DirectAnswer';
import { TRACK_ORDER_CONTENT } from '@/lib/seo-content';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Circle, Package, Truck, Home, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type DeliveryStage = 'ORDER_CONFIRMED' | 'SOURCING' | 'ARRIVED' | 'DISPATCHED' | 'DELIVERED';

interface OrderData {
  order: {
    code: string;
    date: string;
    total: number;
    currency: string;
  };
  deliveryStatus: {
    stage: DeliveryStage;
    tracking_number: string | null;
    note: string | null;
    updated_at: string;
  };
  statusHistory: Array<{
    stage: DeliveryStage;
    tracking_number: string | null;
    note: string | null;
    updated_at: string;
  }>;
  items: Array<{
    product_name: string;
    variant_name: string;
    quantity: number;
    unit_price_with_tax: number;
  }>;
}

const STAGE_CONFIG: Record<DeliveryStage, { label: string; icon: any; color: string; description: string }> = {
  ORDER_CONFIRMED: {
    label: 'Order Confirmed',
    icon: CheckCircle2,
    color: 'text-blue-600',
    description: 'Your order has been confirmed and is ready to be included in the next import batch.',
  },
  SOURCING: {
    label: 'Sourcing',
    icon: Package,
    color: 'text-yellow-600',
    description: 'We are collecting/buying your items from the supplier (pre-order batch in progress).',
  },
  ARRIVED: {
    label: 'Arrived',
    icon: Truck,
    color: 'text-purple-600',
    description: 'Items have arrived to us (Sri Lanka) and are ready for packing and quality check.',
  },
  DISPATCHED: {
    label: 'Dispatched',
    icon: Truck,
    color: 'text-green-600',
    description: 'Your order has been handed over to the courier and is on its way to you.',
  },
  DELIVERED: {
    label: 'Delivered',
    icon: Home,
    color: 'text-emerald-600',
    description: 'Your order has been successfully delivered.',
  },
};

const STAGE_ORDER: DeliveryStage[] = ['ORDER_CONFIRMED', 'SOURCING', 'ARRIVED', 'DISPATCHED', 'DELIVERED'];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const response = await fetch('/api/track-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderCode: orderId.trim(),
          phoneNumber: phoneNumber.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to track order');
        return;
      }

      setOrderData(data);
    } catch (err) {
      setError('Failed to track order. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStageIndex = () => {
    if (!orderData) return -1;
    return STAGE_ORDER.indexOf(orderData.deliveryStatus.stage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: currency || 'LKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const canCancelOrder = () => {
    if (!orderData) return false;
    
    const orderDate = new Date(orderData.order.date);
    const now = new Date();
    const hoursSinceOrder = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
    
    // Can cancel if:
    // 1. Within 24 hours
    // 2. Not already dispatched or delivered
    const isWithin24Hours = hoursSinceOrder <= 24;
    const isNotDispatched = orderData.deliveryStatus.stage !== 'DISPATCHED' && orderData.deliveryStatus.stage !== 'DELIVERED';
    
    return isWithin24Hours && isNotDispatched;
  };

  const handleCancelOrder = async () => {
    if (!orderData) return;
    
    setCancelling(true);
    setCancelError(null);

    try {
      const response = await fetch(`/api/orders/${orderData.order.code}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          reason: cancelReason.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCancelError(data.error || 'Failed to cancel order');
        return;
      }

      setCancelSuccess(true);
      setShowCancelForm(false);
      // Refresh order data to show cancelled status
      setTimeout(() => {
        handleSubmit(new Event('submit') as any);
      }, 1000);
    } catch (err) {
      setCancelError('Failed to cancel order. Please try again.');
      console.error('Error:', err);
    } finally {
      setCancelling(false);
    }
  };

  const hoursSinceOrder = () => {
    if (!orderData) return 0;
    const orderDate = new Date(orderData.order.date);
    const now = new Date();
    return (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-semibold mb-8">
          {TRACK_ORDER_CONTENT.h1}
        </h1>

        {/* Direct Answer Block */}
        <div className="mb-8">
          <DirectAnswer customContent={TRACK_ORDER_CONTENT.directAnswer} />
        </div>

        {/* Track Order Form */}
        {!orderData && (
          <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-lg mb-8">
            <div>
              <Label htmlFor="orderId" className="text-base font-medium mb-2 block">
                Order ID
              </Label>
              <Input
                id="orderId"
                type="text"
                placeholder="Enter your Order ID (e.g., SK-12345)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                className="h-12 text-base"
              />
              <p className="text-sm text-gray-500 mt-2">
                You can find your Order ID in your order confirmation email or SMS.
              </p>
            </div>

            <div>
              <Label htmlFor="phone" className="text-base font-medium mb-2 block">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number (e.g., 94771234567)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="h-12 text-base"
              />
              <p className="text-sm text-gray-500 mt-2">
                Enter the phone number used when placing the order.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading || !orderId || !phoneNumber}
              className="w-full h-12 text-base"
              size="lg"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </Button>
          </form>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p className="text-red-800 font-medium">{error}</p>
            <Button
              onClick={() => {
                setError(null);
                setOrderData(null);
              }}
              variant="outline"
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Order Details */}
        {orderData && (
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Order Details</h2>
                {canCancelOrder() && !cancelSuccess && (
                  <Button
                    onClick={() => setShowCancelForm(true)}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel Order
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Code</p>
                  <p className="text-lg font-semibold">{orderData.order.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="text-lg font-semibold">{formatDate(orderData.order.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(orderData.order.total, orderData.order.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-semibold">
                    {STAGE_CONFIG[orderData.deliveryStatus.stage].label}
                  </p>
                </div>
              </div>
              
              {/* Cancellation Notice */}
              {canCancelOrder() && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> You can cancel this order within 24 hours of placement. 
                    {hoursSinceOrder() < 24 && (
                      <span> You have {Math.floor(24 - hoursSinceOrder())} hours remaining to cancel.</span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Cancel Order Form */}
            {showCancelForm && canCancelOrder() && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">Cancel Order</h3>
                <p className="text-sm text-red-800 mb-4">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>
                
                <div className="mb-4">
                  <Label htmlFor="cancel-reason" className="text-sm font-medium text-gray-700 mb-2 block">
                    Reason for cancellation (optional)
                  </Label>
                  <Input
                    id="cancel-reason"
                    type="text"
                    placeholder="e.g., Changed my mind, Wrong size, etc."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="h-10"
                  />
                </div>

                {cancelError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-sm text-red-800">
                    {cancelError}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                  </button>
                  <button
                    onClick={() => {
                      setShowCancelForm(false);
                      setCancelError(null);
                      setCancelReason('');
                    }}
                    disabled={cancelling}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Cancellation Success */}
            {cancelSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Order Cancelled</h3>
                    <p className="text-sm text-green-800 mt-1">
                      Your order has been successfully cancelled. You will receive a confirmation shortly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Status Timeline */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Delivery Status</h2>
              
              <div className="relative">
                {/* Timeline */}
                <div className="space-y-8">
                  {STAGE_ORDER.map((stage, index) => {
                    const config = STAGE_CONFIG[stage];
                    const Icon = config.icon;
                    const currentIndex = getCurrentStageIndex();
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                      <div key={stage} className="flex gap-6">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                              isCompleted
                                ? `${config.color.replace('text-', 'bg-')} border-${config.color.replace('text-', '')} text-white`
                                : 'bg-gray-100 border-gray-300 text-gray-400'
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          {index < STAGE_ORDER.length - 1 && (
                            <div
                              className={`w-0.5 h-16 ml-6 -mt-2 ${
                                isCompleted ? 'bg-gray-300' : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-8">
                          <div className="flex items-center gap-3 mb-2">
                            <h3
                              className={`text-lg font-semibold ${
                                isCompleted ? 'text-gray-900' : 'text-gray-400'
                              }`}
                            >
                              {config.label}
                            </h3>
                            {isCurrent && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{config.description}</p>
                          
                          {/* Show tracking number for DISPATCHED and DELIVERED */}
                          {isCompleted && (stage === 'DISPATCHED' || stage === 'DELIVERED') && orderData.deliveryStatus.tracking_number && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-sm font-medium text-green-900 mb-1">Tracking Number</p>
                              <p className="text-lg font-mono font-semibold text-green-800 mb-2">
                                {orderData.deliveryStatus.tracking_number}
                              </p>
                              <a
                                href={`https://tracking.transexpress.lk/tracking?tracking=${orderData.deliveryStatus.tracking_number}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-green-700 hover:text-green-900 underline"
                              >
                                Track on Trans Express →
                              </a>
                            </div>
                          )}

                          {/* Show note if available */}
                          {isCurrent && orderData.deliveryStatus.note && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm text-blue-800">{orderData.deliveryStatus.note}</p>
                            </div>
                          )}

                          {/* Show last update time */}
                          {isCurrent && (
                            <p className="text-xs text-gray-500 mt-2">
                              Last updated: {formatDate(orderData.deliveryStatus.updated_at)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items */}
            {orderData.items.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <div className="space-y-3">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        {item.variant_name && (
                          <p className="text-sm text-gray-600">Size: {item.variant_name}</p>
                        )}
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(item.unit_price_with_tax * item.quantity, orderData.order.currency)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Track Another Order */}
            <div className="text-center">
              <Button
                onClick={() => {
                  setOrderData(null);
                  setOrderId('');
                  setPhoneNumber('');
                  setError(null);
                }}
                variant="outline"
              >
                Track Another Order
              </Button>
            </div>
          </div>
        )}

        {/* Help Text */}
        {!orderData && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Need Help?
            </h2>
            <p className="text-gray-700">
              If you're having trouble tracking your order, contact our support team with your Order ID. 
              We're here to help!
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
