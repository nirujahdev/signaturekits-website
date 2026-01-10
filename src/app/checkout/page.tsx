'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { SMSOTPVerification } from '@/components/checkout/SMSOTPVerification';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { checkoutOperations } from '@/lib/vendure-operations';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';

type CheckoutStep = 'cart' | 'shipping' | 'otp' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading, setPhoneVerified, refreshCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [processing, setProcessing] = useState(false);
  
  // Shipping form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    streetLine1: '',
    streetLine2: '',
    city: '',
    province: '',
    postalCode: '',
    countryCode: 'LK',
    phoneNumber: '',
  });

  // Payment method (COD only)
  const [paymentMethod, setPaymentMethod] = useState<'cod'>('cod');
  const [phoneVerified, setPhoneVerifiedState] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    if (!cartLoading && (!cart || cart.lines.length === 0)) {
      router.push('/cart');
    }
  }, [cart, cartLoading, router]);

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      await checkoutOperations.setShippingAddress(shippingAddress);
      await refreshCart();
      setStep('otp');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save shipping address');
    } finally {
      setProcessing(false);
    }
  };

  const handleOTPVerified = async (phone: string, sessionId: string) => {
    try {
      await setPhoneVerified(phone, true);
      setVerifiedPhone(phone);
      setPhoneVerifiedState(true);
      setSessionId(sessionId);
      toast.success('Phone verified!');
      setStep('payment');
    } catch (error: any) {
      toast.error('Failed to verify phone');
    }
  };

  const handlePaymentSubmit = async () => {
    if (paymentMethod === 'cod' && !phoneVerified) {
      toast.error('Please verify your phone number for COD orders');
      return;
    }

    setProcessing(true);
    
    try {
      // Set payment method in order custom fields
      await checkoutOperations.setOrderCustomFields({
        phoneNumber: verifiedPhone || shippingAddress.phoneNumber,
        phoneVerified: phoneVerified || paymentMethod === 'payhere',
      });

      // Transition order to ArrangingPayment
      await checkoutOperations.transitionToArrangingPayment();

      if (paymentMethod === 'payhere') {
        // Create payment and redirect to PayHere
        const paymentResult = await checkoutOperations.addPaymentToOrder({
          method: 'payhere-payment-handler',
          metadata: {
            returnUrl: `${window.location.origin}/checkout/confirmation`,
            cancelUrl: `${window.location.origin}/checkout`,
          },
        });

        // Redirect to PayHere (this would come from the payment metadata)
        // For now, show confirmation
        toast.success('Redirecting to PayHere...');
        // In production: window.location.href = paymentResult.addPaymentToOrder.metadata.redirectUrl;
        setStep('confirmation');
      } else {
        // COD - order is placed
        toast.success('Order placed successfully!');
        setStep('confirmation');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: cart?.currencyCode || 'LKR',
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  if (cartLoading || !cart) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-6 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-semibold mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {['Cart', 'Shipping', 'Verification', 'Payment'].map((stepName, index) => {
              const stepIndex = ['cart', 'shipping', 'otp', 'payment'].indexOf(step);
              const isActive = index <= stepIndex;
              const isCurrent = index === stepIndex;
              
              return (
                <div key={stepName} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        isActive
                          ? 'bg-black text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isActive && index < stepIndex ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`text-xs mt-2 ${isCurrent ? 'font-semibold' : ''}`}>
                      {stepName}
                    </span>
                  </div>
                  {index < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        index < stepIndex ? 'bg-black' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          {step === 'cart' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Review Your Order</h2>
              <div className="space-y-4 mb-6">
                {cart.lines.map((line) => (
                  <div key={line.id} className="flex gap-4 pb-4 border-b">
                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {line.productVariant.product.featuredAsset?.preview && (
                        <img
                          src={line.productVariant.product.featuredAsset.preview}
                          alt={line.productVariant.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{line.productVariant.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {line.productVariant.name} × {line.quantity}
                      </p>
                      {line.customFields && (
                        <div className="text-xs text-gray-600 mt-1">
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
                      {formatPrice((line.productVariant.priceWithTax || 0) * line.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-xl font-semibold">Total</span>
                <span className="text-2xl font-bold">{formatPrice(cart.totalWithTax || 0)}</span>
              </div>
              <Button
                onClick={() => setStep('shipping')}
                className="w-full mt-6"
                size="lg"
              >
                Continue to Shipping
              </Button>
            </div>
          )}

          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit}>
              <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="streetLine1">Address Line 1 *</Label>
                  <Input
                    id="streetLine1"
                    required
                    value={shippingAddress.streetLine1}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, streetLine1: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="streetLine2">Address Line 2</Label>
                  <Input
                    id="streetLine2"
                    value={shippingAddress.streetLine2}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, streetLine2: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      required
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, city: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      required
                      value={shippingAddress.postalCode}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    required
                    placeholder="0771234567"
                    value={shippingAddress.phoneNumber}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, phoneNumber: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full mt-6"
                size="lg"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Continue to Verification'
                )}
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Verify Phone Number</h2>
              <p className="text-gray-600 mb-6">
                We need to verify your phone number to process your order. This helps us prevent fake orders.
              </p>
              <SMSOTPVerification
                onVerified={handleOTPVerified}
                initialPhone={shippingAddress.phoneNumber}
              />
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep('shipping')}
                  className="w-full"
                >
                  Back to Shipping
                </Button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as 'payhere' | 'cod')}
                className="space-y-4 mb-6"
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="payhere" id="payhere" />
                  <Label htmlFor="payhere" className="flex-1 cursor-pointer">
                    <div className="font-semibold">PayHere (Full Payment)</div>
                    <div className="text-sm text-gray-500">
                      Pay securely online with credit/debit card
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Cash on Delivery (COD)</div>
                    <div className="text-sm text-gray-500">
                      Pay when you receive (Phone verification required)
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'cod' && !phoneVerified && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    COD orders require phone verification. Please verify your phone number first.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setStep('otp')}
                    className="mt-2"
                  >
                    Verify Phone Number
                  </Button>
                </div>
              )}

              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Order Total</span>
                  <span className="text-2xl font-bold">{formatPrice(cart.totalWithTax || 0)}</span>
                </div>
                <Button
                  onClick={handlePaymentSubmit}
                  className="w-full"
                  size="lg"
                  disabled={processing || (paymentMethod === 'cod' && !phoneVerified)}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : paymentMethod === 'payhere' ? (
                    'Pay with PayHere'
                  ) : (
                    'Place COD Order'
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-semibold mb-4">Order Placed Successfully!</h2>
              {cart.code && (
                <p className="text-gray-600 mb-2">
                  Order Code: <strong>{cart.code}</strong>
                </p>
              )}
              <p className="text-gray-600 mb-8">
                You will receive a confirmation email shortly.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push(`/orders/${cart.code}`)}>
                  Track Order
                </Button>
                <Button variant="outline" onClick={() => router.push('/')}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

