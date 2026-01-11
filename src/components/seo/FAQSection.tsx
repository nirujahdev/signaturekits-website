/**
 * FAQ Section Component for AEO
 * Modern accordion design with smooth animations and improved styling
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { FAQItem } from '@/lib/seo';
import { ChevronDown } from 'lucide-react';
import { ClientFAQStructuredData } from './ClientFAQStructuredData';
import { gsap } from 'gsap';

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
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Animate content height when opening/closing
    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        if (openIndex === index) {
          gsap.fromTo(
            ref,
            { height: 0, opacity: 0 },
            { 
              height: 'auto', 
              opacity: 1, 
              duration: 0.4,
              ease: 'power2.out',
            }
          );
        } else {
          gsap.to(ref, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
          });
        }
      }
    });
  }, [openIndex]);

  return (
    <>
      {showStructuredData && <ClientFAQStructuredData faqs={faqs} />}
      <div className="my-16 md:my-20">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 dark:text-white mb-10 md:mb-12 tracking-tight">
          {title}
        </h2>
        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900/50 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 md:px-8 py-5 md:py-6 text-left flex items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors duration-200 group"
                >
                  <h3 className="font-semibold text-base md:text-lg text-gray-900 dark:text-white/90 pr-4 flex-1 group-hover:text-gray-950 dark:group-hover:text-white transition-colors">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 md:w-6 md:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-all duration-300 ${
                      isOpen ? 'rotate-180 text-gray-900 dark:text-white' : 'group-hover:text-gray-700 dark:group-hover:text-gray-300'
                    }`}
                  />
                </button>
                <div
                  ref={el => { contentRefs.current[index] = el; }}
                  className="overflow-hidden"
                  style={{ height: 0 }}
                >
                  <div className="px-6 md:px-8 pb-5 md:pb-6 pt-0 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
