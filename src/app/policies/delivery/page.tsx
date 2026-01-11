import { Metadata } from 'next';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { generatePageMetadata } from '@/lib/generate-metadata';
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData';
import { SEO_CONFIG } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Delivery Policy | Shipping, ETA & Tracking – Signature Kits',
  description: 'Delivery policy for Signature Kits: shipping timelines, pre-orders, tracking, failed delivery handling, and support.',
  path: '/policies/delivery',
});

export default function DeliveryPolicyPage() {
  const breadcrumbItems = [
    { name: 'Home', url: SEO_CONFIG.BASE_URL },
    { name: 'Policies', url: `${SEO_CONFIG.BASE_URL}/policies` },
    { name: 'Delivery Policy', url: `${SEO_CONFIG.BASE_URL}/policies/delivery` },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-6 py-12 max-w-4xl pt-24 md:pt-28">
          <div className="mb-8">
            <h1 className="text-4xl font-semibold mb-2">Delivery & Shipping Policy</h1>
            <p className="text-gray-600">Effective date: 10 January 2026</p>
          </div>

          {/* Policy Content - Redirect to Shipping Policy */}
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Our delivery and shipping information is available in our <a href="/policies/shipping" className="text-blue-600 hover:text-blue-800 underline">Shipping Policy</a>.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              For detailed information about:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Pre-order timelines (15-20 business days)</li>
              <li>Shipping methods (Trans Express for Sri Lanka)</li>
              <li>Shipping fees (LKR 400 fixed for Sri Lanka)</li>
              <li>Delivery times (2-5 business days after dispatch)</li>
              <li>Order tracking</li>
              <li>Address and delivery issues</li>
              <li>Customs and duties for international orders</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-6">
              Please visit our <a href="/policies/shipping" className="text-blue-600 hover:text-blue-800 underline font-semibold">Shipping Policy page</a> for complete details.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
