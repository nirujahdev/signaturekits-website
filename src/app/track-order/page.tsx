'use client';

import { useState } from 'react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { DirectAnswer } from '@/components/seo/DirectAnswer';
import { TRACK_ORDER_CONTENT } from '@/lib/seo-content';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Navigate to order tracking with query params
    router.push(`/track-order?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phoneNumber)}`);
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <h1 className="text-4xl font-semibold mb-8">
          {TRACK_ORDER_CONTENT.h1}
        </h1>

        {/* Direct Answer Block */}
        <div className="mb-8">
          <DirectAnswer customContent={TRACK_ORDER_CONTENT.directAnswer} />
        </div>

        {/* Track Order Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-lg">
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

        {/* Help Text */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Need Help?
          </h2>
          <p className="text-gray-700">
            If you're having trouble tracking your order, contact our support team with your Order ID. 
            We're here to help!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

