'use client';

import { useState } from 'react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData';
import { SEO_CONFIG } from '@/lib/seo-config';

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState('shipping');
  const breadcrumbItems = [
    { name: 'Home', url: SEO_CONFIG.BASE_URL },
    { name: 'Policies', url: `${SEO_CONFIG.BASE_URL}/policies` },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-[100px] md:pt-[140px] pb-[80px]">
          <div className="container mx-auto px-4 md:px-6 lg:px-[60px] max-w-7xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-black leading-tight mb-6 md:mb-8">
              Policies
            </h1>
            <p className="text-base md:text-lg text-[#666666] leading-relaxed mb-12">
              Please review our policies to understand our terms of service, shipping, returns, payment, and privacy practices.
            </p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="returns">Returns</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="terms">Terms</TabsTrigger>
            </TabsList>

            {/* Shipping Policy */}
            <TabsContent value="shipping" className="space-y-8">
              <div>
                <h2 className="text-3xl font-semibold mb-2">Shipping Policy</h2>
                <p className="text-gray-600 mb-8">Effective date: 10 January 2026</p>
              </div>

              <div className="prose max-w-none space-y-8">
                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1) Pre-Order Timeline</h3>
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
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2) Shipping Methods</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Sri Lanka:</strong> Orders are delivered via Trans Express.</li>
                    <li><strong>International:</strong> We offer international delivery on a limited basis. The courier/service used may vary by destination.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3) Shipping Fees</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Sri Lanka shipping fee:</strong> LKR 400 (fixed)</li>
                    <li><strong>International shipping fee:</strong> shown at checkout (or confirmed with you before dispatch if required).</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4) Delivery Time (After Dispatch)</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Sri Lanka:</strong> typically 2–5 business days after dispatch (depends on location and courier route).</li>
                    <li><strong>International:</strong> delivery times vary by country and customs clearance.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5) Order Tracking</h3>
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
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6) Incorrect Address / Unreachable Customer</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Please ensure your shipping address and phone number are accurate. If delivery fails due to incorrect details or unavailability, delivery may be delayed and re-dispatch may take additional time.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7) Customs & Duties (International Orders)</h3>
                  <p className="text-gray-700 leading-relaxed">
                    International orders may be subject to customs duties/taxes in the destination country. These charges are typically the customer's responsibility.
                  </p>
                </section>
              </div>
            </TabsContent>

            {/* Returns Policy */}
            <TabsContent value="returns" className="space-y-8">
              <div>
                <h2 className="text-3xl font-semibold mb-2">Returns & Exchanges Policy</h2>
                <p className="text-gray-600 mb-8">Effective date: 10 January 2026</p>
              </div>

              <div className="prose max-w-none space-y-8">
                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1) No Returns / No Exchanges (General Rule)</h3>
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
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2) Customised Items (Strict No Returns)</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If you add customisation (name, number, patches, special prints), the order is final and not returnable or exchangeable.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3) If You Receive a Wrong / Defective / Damaged Item (Limited Remedy)</h3>
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
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4) Shipping Fees</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Shipping fees are not refundable. (If we confirm a wrong/defective/damaged item, we may cover re-delivery costs as part of the resolution, depending on the case.)
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5) Contact</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Email: <a href="mailto:signaturekits.ask@gmail.com" className="text-blue-600 hover:text-blue-800 underline">signaturekits.ask@gmail.com</a>
                  </p>
                </section>
              </div>
            </TabsContent>

            {/* Payment Policy */}
            <TabsContent value="payment" className="space-y-8">
              <div>
                <h2 className="text-3xl font-semibold mb-2">Payment Policy</h2>
                <p className="text-gray-600 mb-8">Effective date: 10 January 2026</p>
              </div>

              <div className="prose max-w-none space-y-8">
                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1) Accepted Payment Method</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We accept <strong>Cash on Delivery (COD)</strong> only.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2) When Payment Is Due</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Payment is due at the time of delivery.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3) Order Confirmation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    After you place an order, we may contact you to confirm order details (size/customisation/address) before processing the pre-order.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4) Refused / Failed Deliveries</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If delivery repeatedly fails due to refusal or being unreachable, we reserve the right to limit or decline future COD orders to prevent operational losses.
                  </p>
                </section>
              </div>
            </TabsContent>

            {/* Privacy Policy */}
            <TabsContent value="privacy" className="space-y-8">
              <div>
                <h2 className="text-3xl font-semibold mb-2">Privacy Policy</h2>
                <p className="text-gray-600 mb-8">Effective date: 10 January 2026</p>
              </div>

              <div className="prose max-w-none space-y-8">
                <section>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Signature Kits respects your privacy and processes personal data responsibly. Sri Lanka's Personal Data Protection Act (PDPA) has announced enforcement commencement dates (including 18 March 2025 for key parts).
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1) Information We Collect</h3>
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
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2) How We Use Your Information</h3>
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
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3) Analytics (Google Analytics)</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may use Google Analytics, which uses cookies to help measure website usage and improve performance. Google notes that Google Analytics uses cookies (e.g., "_ga") to distinguish visitors and report site usage statistics.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    You can opt out of Google Analytics tracking using <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Google's opt-out tools</a>.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4) Sharing Your Information</h3>
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
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5) Data Retention</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We keep order and customer information only as long as needed for operations, record-keeping, and legal requirements, and we delete or anonymize data where feasible.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6) Data Security</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We use reasonable technical and organizational measures to protect personal information from unauthorized access, loss, misuse, or alteration.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7) Your Choices & Rights</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You may request access, correction, or deletion of your personal information (subject to legal/operational needs). To request this, contact: <a href="mailto:signaturekits.ask@gmail.com" className="text-blue-600 hover:text-blue-800 underline">signaturekits.ask@gmail.com</a>
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8) Updates to This Policy</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may update this Privacy Policy by posting a new version on our website.
                  </p>
                </section>
              </div>
            </TabsContent>

            {/* Terms & Conditions */}
            <TabsContent value="terms" className="space-y-8">
              <div>
                <h2 className="text-3xl font-semibold mb-2">Terms & Conditions</h2>
                <p className="text-gray-600 mb-8">Effective date: 10 January 2026</p>
              </div>

              <div className="prose max-w-none space-y-8">
                <section>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    By accessing our website or placing an order, you agree to these Terms.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1) About Signature Kits</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    Signature Kits is an online store based in Sri Lanka.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Contact: <a href="mailto:signaturekits.ask@gmail.com" className="text-blue-600 hover:text-blue-800 underline">signaturekits.ask@gmail.com</a>
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2) Pre-Order Terms</h3>
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
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3) Pricing & Shipping Fees</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Sri Lanka shipping fee:</strong> LKR 400 fixed</li>
                    <li><strong>International shipping fees</strong> may vary by destination and will be shown/confirmed accordingly.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4) Customs & Import Charges (International)</h3>
                  <p className="text-gray-700 leading-relaxed">
                    International orders may incur customs duties/taxes and these are generally payable by the receiver/customer.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5) Customisation</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Customisation (name/number/patches) is optional.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    If selected, you are responsible for confirming spelling, numbers, and selections. Customised orders are final (no returns/exchanges).
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6) No Returns / Limited Remedy</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    All sales are final with no returns/exchanges for change of mind or wrong size selection.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    If you receive a wrong/defective/damaged item, you must notify us within 48 hours, and we will provide a fair resolution if the issue is verified.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7) Order Refusal / Cancellation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may refuse or cancel an order in cases such as suspected fraud, incorrect information, operational limitations, or inability to deliver.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8) Website Accuracy</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We try to present product details accurately; however, colors and appearance may vary by screen/device. Minor batch variations may occur.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9) Limitation of Liability</h3>
                  <p className="text-gray-700 leading-relaxed">
                    To the extent permitted by law, Signature Kits is not liable for indirect losses or delays caused by events beyond reasonable control (supplier delays, courier delays, customs delays, natural events).
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10) Governing Law</h3>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms are governed by the laws of Sri Lanka.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">11) Changes to These Terms</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may update these Terms at any time by posting an updated version on the website.
                  </p>
                </section>
              </div>
            </TabsContent>
          </Tabs>

            <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Questions?</h2>
              <p className="text-gray-700">
                If you have any questions about our policies, please contact us at{' '}
                <a href="mailto:signaturekits.ask@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
                  signaturekits.ask@gmail.com
                </a>
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
