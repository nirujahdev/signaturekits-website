import { Metadata } from 'next';
import { generateCategoryMetadata, generatePageMetadata } from '@/lib/generate-metadata';
import { generateCategoryTitle, generateCategoryDescription, DEFAULT_CATEGORY_FAQS } from '@/lib/seo';

const COLLECTION_INFO: Record<string, { title: string; description: string; seoTitle?: string; seoDescription?: string }> = {
  retro: {
    title: 'Retro Jerseys',
    description: 'Classic jerseys from iconic seasons. Relive the glory days with authentic retro designs.',
    seoTitle: 'Retro Football Jerseys Sri Lanka | Vintage Club & National Team Kits – Signature Kits',
    seoDescription: 'Shop retro football jerseys in Sri Lanka. Classic designs from iconic seasons. Pre-order vintage club and national team kits. Islandwide delivery. Find your size with our size guide.',
  },
  clubs: {
    title: 'Club Jerseys',
    description: 'Support your favorite clubs with official jerseys from leagues around the world.',
    seoTitle: 'Club Football Jerseys Sri Lanka | Premier League, La Liga & More – Signature Kits',
    seoDescription: 'Shop club football jerseys in Sri Lanka: Premier League, La Liga, Serie A, and more. Pre-order options + islandwide delivery. Add name & number. COD available.',
  },
  countries: {
    title: 'National Team Jerseys',
    description: 'Represent your country with pride. Official national team jerseys for men and women.',
    seoTitle: 'National Team Jerseys Sri Lanka | World Cup & International Kits – Signature Kits',
    seoDescription: 'Shop national team football jerseys in Sri Lanka. World Cup kits, international jerseys. Pre-order options + islandwide delivery. Find your size with our size guide.',
  },
  kids: {
    title: 'Kids Jerseys',
    description: 'Perfect fit for young fans. All your favorite teams and players in kids sizes.',
    seoTitle: 'Kids Football Jerseys Sri Lanka | Youth Sizes – Signature Kits',
    seoDescription: 'Shop kids football jerseys in Sri Lanka. Youth sizes for young fans. Pre-order options + islandwide delivery. Add name & number. COD available.',
  },
};

export function generateCollectionMetadata(slug: string): Metadata {
  const collectionInfo = COLLECTION_INFO[slug] || {
    title: slug.charAt(0).toUpperCase() + slug.slice(1),
    description: 'Browse our collection of premium jerseys.',
    seoTitle: generateCategoryTitle(slug.charAt(0).toUpperCase() + slug.slice(1)),
    seoDescription: generateCategoryDescription(slug.charAt(0).toUpperCase() + slug.slice(1)),
  };

  return generatePageMetadata({
    title: collectionInfo.seoTitle || generateCategoryTitle(collectionInfo.title),
    description: collectionInfo.seoDescription || generateCategoryDescription(collectionInfo.title),
    path: `/collections/${slug}`,
  });
}

export { COLLECTION_INFO, DEFAULT_CATEGORY_FAQS };

