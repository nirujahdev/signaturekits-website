import { Metadata } from 'next';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { generatePageMetadata } from '@/lib/generate-metadata';
import { DELIVERY_POLICY_CONTENT } from '@/lib/seo-content';
import { DirectAnswer } from '@/components/seo/DirectAnswer';
import { FAQSection } from '@/components/seo/FAQSection';
import { FAQStructuredData } from '@/components/seo/StructuredData';
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData';
import { SEO_CONFIG } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: DELIVERY_POLICY_CONTENT.title,
  description: DELIVERY_POLICY_CONTENT.description,
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
      <FAQStructuredData faqs={DELIVERY_POLICY_CONTENT.faqs} />
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-6 py-12 max-w-4xl">
          <h1 className="text-4xl font-semibold mb-8">
            {DELIVERY_POLICY_CONTENT.h1}
          </h1>

          {/* Direct Answer Block */}
          <div className="mb-8">
            <DirectAnswer customContent={DELIVERY_POLICY_CONTENT.directAnswer} />
          </div>

          {/* Policy Content */}
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At Signature Kits, we are committed to delivering your premium football jerseys across Sri Lanka. 
              Our delivery policy is designed to be transparent and customer-friendly, ensuring you know exactly 
              when to expect your order.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Delivery Timeline
            </h2>
            <p className="text-gray-700 mb-4">
              Delivery time depends on whether your item is in-stock or a pre-order:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li><strong>In-stock items:</strong> Ship within 2-3 business days after order confirmation</li>
              <li><strong>Pre-order items:</strong> Ship within {SEO_CONFIG.DELIVERY_WINDOW} after order confirmation</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Islandwide Delivery
            </h2>
            <p className="text-gray-700 mb-4">
              We deliver across all major cities and towns in Sri Lanka, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Colombo and Greater Colombo area</li>
              <li>Kandy, Galle, Jaffna, Negombo, Kurunegala</li>
              <li>All other major cities and towns</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Delivery times may vary by location. Remote areas may take additional 2-3 days.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Tracking Your Order
            </h2>
            <p className="text-gray-700 mb-4">
              Once your order reaches the {SEO_CONFIG.TRACKING_STAGE} stage, you will receive:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Tracking number via SMS and email</li>
              <li>Link to track your order on our Track Order page</li>
              <li>Courier tracking link (when available)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Payment Options
            </h2>
            <p className="text-gray-700 mb-4">
              We offer multiple payment methods:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li><strong>Online Payment:</strong> Secure checkout via PayHere (credit/debit cards, bank transfers)</li>
              <li><strong>Cash on Delivery (COD):</strong> Available in select areas. Requires SMS OTP verification</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Failed Deliveries
            </h2>
            <p className="text-gray-700 mb-4">
              If delivery fails due to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>No one available at the delivery address</li>
              <li>Incorrect address provided</li>
              <li>Recipient unavailable</li>
            </ul>
            <p className="text-gray-700 mb-6">
              The courier will attempt re-delivery. Additional delivery charges may apply depending on courier policy. 
              Contact us immediately if you need to update your delivery address.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Returns & Exchanges
            </h2>
            <p className="text-gray-700 mb-6">
              Size exchanges are available within 7 days of delivery, subject to stock availability and product condition. 
              See our Returns Policy for detailed terms and conditions.
            </p>
          </div>

          {/* FAQ Section */}
          <FAQSection faqs={DELIVERY_POLICY_CONTENT.faqs} title="Delivery & Shipping FAQs" />
        </main>
        <Footer />
      </div>
    </>
  );
}

