/**
 * Structured Data Components for SEO
 * Renders JSON-LD schema markup
 * 
 * Note: Marked as client component to work with client-side pages
 * Structured data works fine when rendered on the client
 */

'use client';

import { FAQItem, ProductSEOData } from '@/lib/seo';

interface StructuredDataProps {
  data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Product structured data (Product + Offer schema)
 */
export function ProductStructuredData({
  product,
  url,
  images,
  price,
  currency = 'LKR',
  availability = 'PreOrder',
  brand = 'Signature Kits',
  sku,
}: {
  product: {
    name: string;
    description: string;
  };
  url: string;
  images: string[];
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
  sku?: string;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    sku: sku || product.name.replace(/\s+/g, '-').toLowerCase(),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: currency,
      price: price?.toString() || '0',
      availability: `https://schema.org/${availability}`,
      itemCondition: 'https://schema.org/NewCondition',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'LKR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          businessDays: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          },
          cutoffTime: '14:00',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 10,
            maxValue: 20,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
        },
      },
    },
  };

  return <StructuredData data={structuredData} />;
}

/**
 * BreadcrumbList structured data
 */
export function BreadcrumbStructuredData({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  // Defensive check: ensure items is valid array
  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  // Filter out invalid items and ensure required fields
  const validItems = items
    .filter((item) => item && typeof item.name === 'string' && typeof item.url === 'string')
    .map((item) => ({
      name: item.name.trim(),
      url: item.url.trim(),
    }))
    .filter((item) => item.name && item.url);

  if (validItems.length === 0) {
    return null;
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: validItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <StructuredData data={structuredData} />;
}

/**
 * Organization structured data (for homepage)
 */
export function OrganizationStructuredData({
  name = 'Signature Kits',
  url = 'https://signaturekits-website.vercel.app',
  logo,
  socialLinks,
}: {
  name?: string;
  url?: string;
  logo?: string;
  socialLinks?: string[];
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(logo && {
      logo: {
        '@type': 'ImageObject',
        url: logo,
      },
    }),
    ...(socialLinks && socialLinks.length > 0 && {
      sameAs: socialLinks,
    }),
  };

  return <StructuredData data={structuredData} />;
}

/**
 * FAQPage structured data
 */
export function FAQStructuredData({ faqs }: { faqs: FAQItem[] }) {
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

  return <StructuredData data={structuredData} />;
}

