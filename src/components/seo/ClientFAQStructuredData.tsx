'use client';

import type { FAQItem } from '@/lib/seo';

interface ClientFAQStructuredDataProps {
  faqs: FAQItem[];
}

/**
 * Client-only FAQ structured data component
 * Renders JSON-LD schema markup for FAQPage
 */
export function ClientFAQStructuredData({ faqs }: ClientFAQStructuredDataProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

