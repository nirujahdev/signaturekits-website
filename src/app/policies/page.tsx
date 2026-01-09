import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-semibold mb-8">Policies</h1>

        <Tabs defaultValue="shipping" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="terms">Terms</TabsTrigger>
          </TabsList>

          <TabsContent value="shipping" className="mt-6" id="shipping">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Shipping Policy</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Pre-Order Timeline</h3>
              <p className="text-gray-700 mb-4">
                All jerseys are pre-order items. Once your order is confirmed, we place a bulk order
                with our supplier. Your order will be shipped within <strong>15-20 business days</strong> from
                the date of order confirmation.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Shipping Methods</h3>
              <p className="text-gray-700 mb-4">
                We ship all orders via <strong>Trans Express</strong>, a trusted local delivery partner.
                Shipping is free on all orders. You will receive tracking information once your order
                has been dispatched.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Delivery Areas</h3>
              <p className="text-gray-700 mb-4">
                We currently deliver to all areas in Sri Lanka. Delivery times may vary based on your
                location, but typically range from 2-5 business days after dispatch.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Order Tracking</h3>
              <p className="text-gray-700">
                Once your order is dispatched, you will receive a tracking number via SMS and email.
                You can track your order using the order code on our website.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="returns" className="mt-6">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Returns & Exchanges</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Return Policy</h3>
              <p className="text-gray-700 mb-4">
                We accept returns within <strong>7 days</strong> of delivery for items that are:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Unworn and in original condition</li>
                <li>With original tags attached</li>
                <li>In original packaging</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Customized Items</h3>
              <p className="text-gray-700 mb-4">
                Items with customizations (name, number, or patches) cannot be returned unless there
                is a manufacturing defect or error on our part.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Exchange Process</h3>
              <p className="text-gray-700 mb-4">
                To initiate a return or exchange, please contact us at{' '}
                <a href="mailto:support@signaturekits.xyz" className="text-blue-600 hover:underline">
                  support@signaturekits.xyz
                </a>{' '}
                with your order code and reason for return.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Refunds</h3>
              <p className="text-gray-700">
                Refunds will be processed within 5-7 business days after we receive and inspect the
                returned item. Refunds will be issued to the original payment method.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="mt-6">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Payment Policy</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Payment Methods</h3>
              <p className="text-gray-700 mb-4">
                We accept the following payment methods:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>PayHere:</strong> Secure online payment via credit/debit card</li>
                <li><strong>Cash on Delivery (COD):</strong> Pay when you receive your order</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">COD Requirements</h3>
              <p className="text-gray-700 mb-4">
                Cash on Delivery orders require SMS phone verification to prevent fake orders.
                You will receive an OTP via SMS that must be verified before your order is confirmed.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Payment Security</h3>
              <p className="text-gray-700 mb-4">
                All online payments are processed securely through PayHere. We do not store your
                credit card information on our servers.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Order Confirmation</h3>
              <p className="text-gray-700">
                Once your payment is confirmed, you will receive an order confirmation email with
                your order code. For COD orders, confirmation is sent after phone verification.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="mt-6" id="privacy">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Information We Collect</h3>
              <p className="text-gray-700 mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Name, email address, and phone number</li>
                <li>Shipping and billing addresses</li>
                <li>Payment information (processed securely through PayHere)</li>
                <li>Order history and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">How We Use Your Information</h3>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and tracking information</li>
                <li>Verify your identity for COD orders via SMS OTP</li>
                <li>Improve our services and customer experience</li>
                <li>Communicate with you about your orders and our products</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Data Security</h3>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your personal information.
                All payment transactions are processed securely through PayHere, and we do not
                store your credit card information on our servers.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Third-Party Services</h3>
              <p className="text-gray-700 mb-4">
                We may share your information with trusted third-party service providers who
                assist us in operating our website, processing payments, and delivering orders.
                These providers are required to maintain the confidentiality of your information.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Your Rights</h3>
              <p className="text-gray-700">
                You have the right to access, update, or delete your personal information at any time.
                To exercise these rights, please contact us at{' '}
                <a href="mailto:support@signaturekits.xyz" className="text-blue-600 hover:underline">
                  support@signaturekits.xyz
                </a>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="terms" className="mt-6" id="terms">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Terms & Conditions</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Pre-Order Policy</h3>
              <p className="text-gray-700 mb-4">
                By placing a pre-order, you acknowledge that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Your order will be fulfilled within 15-20 business days</li>
                <li>We place bulk orders with suppliers only after reaching order thresholds</li>
                <li>Delivery dates are estimates and may vary</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Product Availability</h3>
              <p className="text-gray-700 mb-4">
                All products are subject to availability. If an item becomes unavailable after you
                place an order, we will notify you and offer a full refund or alternative product.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Customization</h3>
              <p className="text-gray-700 mb-4">
                Customizations (name, number, patches) are final once the order is confirmed.
                Please double-check all customization details before placing your order.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Limitation of Liability</h3>
              <p className="text-gray-700 mb-4">
                Signature Kits is not responsible for any delays caused by suppliers, shipping
                carriers, or circumstances beyond our control.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Contact Us</h3>
              <p className="text-gray-700">
                For any questions or concerns, please contact us at{' '}
                <a href="mailto:support@signaturekits.xyz" className="text-blue-600 hover:underline">
                  support@signaturekits.xyz
                </a>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}

