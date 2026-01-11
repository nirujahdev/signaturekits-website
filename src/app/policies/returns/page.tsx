import { Metadata } from 'next';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { generatePageMetadata } from '@/lib/generate-metadata';
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData';
import { SEO_CONFIG } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Returns & Exchanges Policy | Signature Kits',
  description: 'Returns and exchanges policy for Signature Kits: no returns for change of mind, limited remedy for wrong/defective items. Customised items are final.',
  path: '/policies/returns',
});

export default function ReturnsPolicyPage() {
  const breadcrumbItems = [
    { name: 'Home', url: SEO_CONFIG.BASE_URL },
    { name: 'Policies', url: `${SEO_CONFIG.BASE_URL}/policies` },
    { name: 'Returns & Exchanges', url: `${SEO_CONFIG.BASE_URL}/policies/returns` },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-6 py-12 max-w-4xl pt-24 md:pt-28">
          <div className="mb-8">
            <h1 className="text-4xl font-semibold mb-2">Returns & Exchanges Policy</h1>
            <p className="text-gray-600">Effective date: 10 January 2026</p>
          </div>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1) No Returns / No Exchanges (General Rule)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Because our items are pre-order and we provide a detailed size chart, we do not accept returns or exchanges for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>change of mind</li>
                <li>wrong size selection</li>
                <li>preference changes</li>
                <li>delayed delivery timelines within the stated estimates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2) Customised Items (Strict No Returns)</h2>
              <p className="text-gray-700 leading-relaxed">
                If you add customisation (name, number, patches, special prints), the order is final and not returnable or exchangeable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3) If You Receive a Wrong / Defective / Damaged Item (Limited Remedy)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you receive:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>the wrong item, or</li>
                <li>a manufacturing defect, or</li>
                <li>damage during delivery</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                You must contact us within <strong>48 hours</strong> of delivery with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>your Order ID</li>
                <li>clear photos/videos (including packaging if relevant)</li>
                <li>a short description of the issue</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                If verified, we will offer an appropriate solution (such as replacement, correction, or refund) based on the case and availability. Consumer remedies like repair/replacement/refund are commonly recognized pathways when goods are faulty.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4) Shipping Fees</h2>
              <p className="text-gray-700 leading-relaxed">
                Shipping fees are not refundable. (If we confirm a wrong/defective/damaged item, we may cover re-delivery costs as part of the resolution, depending on the case.)
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5) Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                Email: <a href="mailto:signaturekits.ask@gmail.com" className="text-blue-600 hover:text-blue-800 underline">signaturekits.ask@gmail.com</a>
              </p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

