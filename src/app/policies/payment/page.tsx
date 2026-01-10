import { Metadata } from 'next';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { generatePageMetadata } from '@/lib/generate-metadata';
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData';
import { SEO_CONFIG } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Payment Policy | COD Only – Signature Kits',
  description: 'Payment policy for Signature Kits: Cash on Delivery (COD) only. Payment due at delivery. Order confirmation process.',
  path: '/policies/payment',
});

export default function PaymentPolicyPage() {
  const breadcrumbItems = [
    { name: 'Home', url: SEO_CONFIG.BASE_URL },
    { name: 'Policies', url: `${SEO_CONFIG.BASE_URL}/policies` },
    { name: 'Payment Policy', url: `${SEO_CONFIG.BASE_URL}/policies/payment` },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-semibold mb-2">Payment Policy</h1>
            <p className="text-gray-600">Effective date: 10 January 2026</p>
          </div>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1) Accepted Payment Method</h2>
              <p className="text-gray-700 leading-relaxed">
                We accept <strong>Cash on Delivery (COD)</strong> only.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2) When Payment Is Due</h2>
              <p className="text-gray-700 leading-relaxed">
                Payment is due at the time of delivery.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3) Order Confirmation</h2>
              <p className="text-gray-700 leading-relaxed">
                After you place an order, we may contact you to confirm order details (size/customisation/address) before processing the pre-order.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4) Refused / Failed Deliveries</h2>
              <p className="text-gray-700 leading-relaxed">
                If delivery repeatedly fails due to refusal or being unreachable, we reserve the right to limit or decline future COD orders to prevent operational losses.
              </p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

