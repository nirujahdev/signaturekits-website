import { Metadata } from 'next';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { generatePageMetadata } from '@/lib/generate-metadata';
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData';
import { SEO_CONFIG } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Shipping Policy | Delivery & Tracking – Signature Kits',
  description: 'Shipping policy for Signature Kits: pre-order timeline (15-20 days), shipping methods, fees, delivery times, and order tracking in Sri Lanka.',
  path: '/policies/shipping',
});

export default function ShippingPolicyPage() {
  const breadcrumbItems = [
    { name: 'Home', url: SEO_CONFIG.BASE_URL },
    { name: 'Policies', url: `${SEO_CONFIG.BASE_URL}/policies` },
    { name: 'Shipping Policy', url: `${SEO_CONFIG.BASE_URL}/policies/shipping` },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-semibold mb-2">Shipping Policy</h1>
            <p className="text-gray-600">Effective date: 10 January 2026</p>
          </div>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1) Pre-Order Timeline</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All jerseys sold on Signature Kits are pre-order items (unless stated otherwise). After your order is confirmed, we place a bulk order with our supplier.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Processing + production time:</strong> typically 15–20 business days from order confirmation.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Note:</strong> These are estimates and may vary due to supplier production timelines, high demand, and external delays.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2) Shipping Methods</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Sri Lanka:</strong> Orders are delivered via Trans Express.</li>
                <li><strong>International:</strong> We offer international delivery on a limited basis. The courier/service used may vary by destination.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3) Shipping Fees</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Sri Lanka shipping fee:</strong> LKR 400 (fixed)</li>
                <li><strong>International shipping fee:</strong> shown at checkout (or confirmed with you before dispatch if required).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4) Delivery Time (After Dispatch)</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Sri Lanka:</strong> typically 2–5 business days after dispatch (depends on location and courier route).</li>
                <li><strong>International:</strong> delivery times vary by country and customs clearance.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5) Order Tracking</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can track your order on the <a href="/track-order" className="text-blue-600 hover:text-blue-800 underline">Track My Order</a> page using:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Order ID</li>
                <li>Phone number</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                When your order status becomes <strong>Dispatched</strong>, your Trans Express tracking number will appear in the tracking timeline, and you can track it through the courier tracking system.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6) Incorrect Address / Unreachable Customer</h2>
              <p className="text-gray-700 leading-relaxed">
                Please ensure your shipping address and phone number are accurate. If delivery fails due to incorrect details or unavailability, delivery may be delayed and re-dispatch may take additional time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7) Customs & Duties (International Orders)</h2>
              <p className="text-gray-700 leading-relaxed">
                International orders may be subject to customs duties/taxes in the destination country. These charges are typically the customer's responsibility.
              </p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

