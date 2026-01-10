import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://signaturekits-website.vercel.app';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/cart',
          '/checkout',
          '/account',
          '/track-order',
          '/admin',
          '/api',
          '/search?*', // Search pages with query params
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

