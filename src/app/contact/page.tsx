import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/generate-metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Us',
  description: 'Get in touch with Signature Kits for any questions or support.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[100px] md:pt-[140px] pb-[80px]">
        <div className="container mx-auto px-4 md:px-6 lg:px-[60px] max-w-7xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-black leading-tight mb-12 md:mb-16">
            Contact Us
          </h1>

          <p className="text-base md:text-lg text-[#666666] leading-relaxed mb-12">
            Have a question or need assistance? We're here to help!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <a 
                    href="mailto:support@signaturekits.xyz" 
                    className="text-blue-600 hover:underline"
                  >
                    support@signaturekits.xyz
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                  <p className="text-gray-700">
                    We typically respond within 24-48 hours during business days.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Order Support</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Track Your Order</h3>
                  <p className="text-gray-700 mb-2">
                    Use your order code to track your order status.
                  </p>
                  <a 
                    href="/orders" 
                    className="text-blue-600 hover:underline"
                  >
                    Track Order →
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Order Issues</h3>
                  <p className="text-gray-700">
                    For order-related questions, please include your order code in your message.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How long does shipping take?</h3>
                <p className="text-gray-700">
                  All orders are pre-orders and will be shipped within 15-20 business days from order confirmation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I cancel my order?</h3>
                <p className="text-gray-700">
                  Orders can be cancelled within 24 hours of placement. After that, orders are processed and cannot be cancelled.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do you ship internationally?</h3>
                <p className="text-gray-700">
                  Currently, we only ship within Sri Lanka. We're working on expanding our shipping options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

