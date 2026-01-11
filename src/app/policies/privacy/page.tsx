import { Metadata } from 'next';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { generatePageMetadata } from '@/lib/generate-metadata';
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData';
import { SEO_CONFIG } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Privacy Policy | Data Protection – Signature Kits',
  description: 'Privacy policy for Signature Kits: how we collect, use, and protect your personal information. Compliant with Sri Lanka Personal Data Protection Act (PDPA).',
  path: '/policies/privacy',
});

export default function PrivacyPolicyPage() {
  const breadcrumbItems = [
    { name: 'Home', url: SEO_CONFIG.BASE_URL },
    { name: 'Policies', url: `${SEO_CONFIG.BASE_URL}/policies` },
    { name: 'Privacy Policy', url: `${SEO_CONFIG.BASE_URL}/policies/privacy` },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-6 py-12 max-w-4xl pt-24 md:pt-28">
          <div className="mb-8">
            <h1 className="text-4xl font-semibold mb-2">Privacy Policy</h1>
            <p className="text-gray-600">Effective date: 10 January 2026</p>
          </div>

          <div className="prose max-w-none space-y-8">
            <section>
              <p className="text-gray-700 leading-relaxed mb-4">
                Signature Kits respects your privacy and processes personal data responsibly. Sri Lanka's Personal Data Protection Act (PDPA) has announced enforcement commencement dates (including 18 March 2025 for key parts).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1) Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may collect:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Name</li>
                <li>Phone number</li>
                <li>Email address</li>
                <li>Shipping address</li>
                <li>Order details (items, sizes, and any customisation details)</li>
                <li>Basic technical data (IP address, device/browser type, pages visited) via cookies/analytics (if enabled)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2) How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Process and fulfill orders</li>
                <li>Provide order updates and tracking</li>
                <li>Provide customer support</li>
                <li>Improve website experience and performance analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3) Analytics (Google Analytics)</h2>
              <p className="text-gray-700 leading-relaxed">
                We may use Google Analytics, which uses cookies to help measure website usage and improve performance. Google notes that Google Analytics uses cookies (e.g., "_ga") to distinguish visitors and report site usage statistics.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                You can opt out of Google Analytics tracking using <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Google's opt-out tools</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4) Sharing Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may share limited information only when necessary with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Delivery partners (for shipping and delivery)</li>
                <li>Service providers that help run our website (hosting, analytics, customer service tools)</li>
                <li>Authorities where required under lawful request</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5) Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We keep order and customer information only as long as needed for operations, record-keeping, and legal requirements, and we delete or anonymize data where feasible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6) Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We use reasonable technical and organizational measures to protect personal information from unauthorized access, loss, misuse, or alteration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7) Your Choices & Rights</h2>
              <p className="text-gray-700 leading-relaxed">
                You may request access, correction, or deletion of your personal information (subject to legal/operational needs). To request this, contact: <a href="mailto:signaturekits.ask@gmail.com" className="text-blue-600 hover:text-blue-800 underline">signaturekits.ask@gmail.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8) Updates to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy by posting a new version on our website.
              </p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

