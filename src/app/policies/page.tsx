import { Metadata } from 'next';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/generate-metadata';
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData';
import { SEO_CONFIG } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Policies | Shipping, Returns, Payment, Privacy & Terms – Signature Kits',
  description: 'View all Signature Kits policies: shipping, returns & exchanges, payment, privacy, and terms & conditions.',
  path: '/policies',
});

const policies = [
  {
    title: 'Shipping Policy',
    href: '/policies/shipping',
    description: 'Pre-order timelines, shipping methods, fees, delivery times, and order tracking.',
  },
  {
    title: 'Returns & Exchanges',
    href: '/policies/returns',
    description: 'Returns policy, customised items, and limited remedy for wrong/defective items.',
  },
  {
    title: 'Payment Policy',
    href: '/policies/payment',
    description: 'Cash on Delivery (COD) only, payment terms, and order confirmation.',
  },
  {
    title: 'Privacy Policy',
    href: '/policies/privacy',
    description: 'How we collect, use, and protect your personal information. PDPA compliant.',
  },
  {
    title: 'Terms & Conditions',
    href: '/policies/terms',
    description: 'Terms of service, pre-order terms, customisation, and governing law.',
  },
];

export default function PoliciesPage() {
  const breadcrumbItems = [
    { name: 'Home', url: SEO_CONFIG.BASE_URL },
    { name: 'Policies', url: `${SEO_CONFIG.BASE_URL}/policies` },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="mb-12">
            <h1 className="text-4xl font-semibold mb-4">Policies</h1>
            <p className="text-lg text-gray-600">
              Please review our policies to understand our terms of service, shipping, returns, payment, and privacy practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policies.map((policy) => (
              <Link
                key={policy.href}
                href={policy.href}
                className="block p-6 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{policy.title}</h2>
                <p className="text-gray-600 text-sm">{policy.description}</p>
                <span className="text-blue-600 text-sm font-medium mt-3 inline-block">
                  Read more →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Questions?</h2>
            <p className="text-gray-700">
              If you have any questions about our policies, please contact us at{' '}
              <a href="mailto:signaturekits.ask@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
                signaturekits.ask@gmail.com
              </a>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
