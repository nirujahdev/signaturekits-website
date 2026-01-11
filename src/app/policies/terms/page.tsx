import { Metadata } from 'next';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { generatePageMetadata } from '@/lib/generate-metadata';
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData';
import { SEO_CONFIG } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Terms & Conditions | Signature Kits',
  description: 'Terms and conditions for Signature Kits: pre-order terms, pricing, customisation, returns policy, and governing law. Effective 10 January 2026.',
  path: '/policies/terms',
});

export default function TermsPage() {
  const breadcrumbItems = [
    { name: 'Home', url: SEO_CONFIG.BASE_URL },
    { name: 'Policies', url: `${SEO_CONFIG.BASE_URL}/policies` },
    { name: 'Terms & Conditions', url: `${SEO_CONFIG.BASE_URL}/policies/terms` },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-6 py-12 max-w-4xl pt-24 md:pt-28">
          <div className="mb-8">
            <h1 className="text-4xl font-semibold mb-2">Terms & Conditions</h1>
            <p className="text-gray-600">Effective date: 10 January 2026</p>
          </div>

          <div className="prose max-w-none space-y-8">
            <section>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing our website or placing an order, you agree to these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1) About Signature Kits</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                Signature Kits is an online store based in Sri Lanka.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Contact: <a href="mailto:signaturekits.ask@gmail.com" className="text-blue-600 hover:text-blue-800 underline">signaturekits.ask@gmail.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2) Pre-Order Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By placing an order, you acknowledge:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Items are pre-order unless stated otherwise</li>
                <li>Estimated processing timeline is 15–20 business days from confirmation</li>
                <li>Delivery dates are estimates and may change due to supplier/courier delays</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3) Pricing & Shipping Fees</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Sri Lanka shipping fee:</strong> LKR 400 fixed</li>
                <li><strong>International shipping fees</strong> may vary by destination and will be shown/confirmed accordingly.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4) Customs & Import Charges (International)</h2>
              <p className="text-gray-700 leading-relaxed">
                International orders may incur customs duties/taxes and these are generally payable by the receiver/customer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5) Customisation</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Customisation (name/number/patches) is optional.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If selected, you are responsible for confirming spelling, numbers, and selections. Customised orders are final (no returns/exchanges).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6) No Returns / Limited Remedy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All sales are final with no returns/exchanges for change of mind or wrong size selection.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you receive a wrong/defective/damaged item, you must notify us within 48 hours, and we will provide a fair resolution if the issue is verified.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7) Order Refusal / Cancellation</h2>
              <p className="text-gray-700 leading-relaxed">
                We may refuse or cancel an order in cases such as suspected fraud, incorrect information, operational limitations, or inability to deliver.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8) Website Accuracy</h2>
              <p className="text-gray-700 leading-relaxed">
                We try to present product details accurately; however, colors and appearance may vary by screen/device. Minor batch variations may occur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9) Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                To the extent permitted by law, Signature Kits is not liable for indirect losses or delays caused by events beyond reasonable control (supplier delays, courier delays, customs delays, natural events).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10) Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by the laws of Sri Lanka.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">11) Changes to These Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update these Terms at any time by posting an updated version on the website.
              </p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

