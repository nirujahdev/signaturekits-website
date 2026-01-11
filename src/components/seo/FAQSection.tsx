/**
 * FAQ Section Component for AEO
 * Displays FAQ questions and answers in an SEO-friendly format
 */

'use client';

import { useState } from 'react';
import { FAQItem } from '@/lib/seo';
import { ChevronDown } from 'lucide-react';
import { ClientFAQStructuredData } from './ClientFAQStructuredData';

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  showStructuredData?: boolean;
}

export function FAQSection({ 
  faqs, 
  title = 'Frequently Asked Questions',
  showStructuredData = true 
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {showStructuredData && <ClientFAQStructuredData faqs={faqs} />}
      <div className="my-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
          {title}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800 dark:text-white/90 pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

