/**
 * Metadata Generation Utilities
 * Creates Next.js Metadata objects for SEO
 */

import { Metadata } from 'next';
import { generateCanonicalUrl, shouldNoIndex } from './seo';

export interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
  canonical?: string;
}

/**
 * Generate Next.js Metadata object for a page
 */
export function generatePageMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex,
  canonical,
}: PageMetadataOptions): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://signaturekits-website.vercel.app';
  const canonicalUrl = canonical || generateCanonicalUrl(path, baseUrl);
  const shouldNoIndexPage = noIndex !== undefined ? noIndex : shouldNoIndex(path);
  const ogImageUrl = ogImage 
    ? (ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`)
    : `${baseUrl}/og-image.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Signature Kits',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_LK',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    robots: shouldNoIndexPage
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}

/**
 * Generate product page metadata
 */
export function generateProductMetadata(
  productName: string,
  description: string,
  slug: string,
  price?: number,
  image?: string,
  isPreOrder: boolean = true
): Metadata {
  const title = `${productName} in Sri Lanka${isPreOrder ? ' (Pre-Order)' : ''} | Signature Kits`;
  const metaDescription = `Premium replica jersey with Dri-Fit comfort. Pre-order now with islandwide delivery in 10–20 days. Add name & number. Secure checkout + COD available.`;

  return generatePageMetadata({
    title,
    description: metaDescription,
    path: `/product/${slug}`,
    ogImage: image,
  });
}

/**
 * Generate category page metadata
 */
export function generateCategoryMetadata(
  categoryName: string,
  description: string,
  slug: string
): Metadata {
  const title = `${categoryName} in Sri Lanka | Signature Kits`;
  
  return generatePageMetadata({
    title,
    description,
    path: `/collections/${slug}`,
  });
}

