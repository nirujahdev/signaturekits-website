/**
 * SEO Utilities for Signature Kits
 * Handles metadata generation, structured data, and SEO best practices
 */

export interface SEOData {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  robots?: string;
  faq?: FAQItem[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProductSEOData extends SEOData {
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
  sku?: string;
  images?: string[];
}

/**
 * Generate product title following Sri Lanka SEO best practices
 */
export function generateProductTitle(
  productName: string,
  isPreOrder: boolean = true,
  brand: string = 'Signature Kits'
): string {
  const preOrderText = isPreOrder ? ' (Pre-Order)' : '';
  return `${productName} in Sri Lanka${preOrderText} | ${brand}`;
}

/**
 * Generate product meta description
 */
export function generateProductDescription(
  productName: string,
  deliveryDays: string = '10–20',
  hasCustomization: boolean = true,
  hasCOD: boolean = true
): string {
  const customizationText = hasCustomization ? ' Add name & number.' : '';
  const codText = hasCOD ? ' Secure checkout + COD available.' : ' Secure checkout.';
  return `Premium replica jersey with Dri-Fit comfort. Pre-order now with islandwide delivery in ${deliveryDays} days.${customizationText}${codText}`;
}

/**
 * Generate category title
 */
export function generateCategoryTitle(
  categoryName: string,
  brand: string = 'Signature Kits'
): string {
  return `${categoryName} in Sri Lanka | ${brand}`;
}

/**
 * Generate category description
 */
export function generateCategoryDescription(
  categoryName: string,
  hasPreOrder: boolean = true,
  hasSizeGuide: boolean = true
): string {
  const preOrderText = hasPreOrder ? ' Pre-order options +' : '';
  const sizeGuideText = hasSizeGuide ? ' Find your size with our size guide.' : '';
  return `Shop ${categoryName.toLowerCase()} in Sri Lanka: premium quality jerseys with islandwide delivery.${preOrderText}${sizeGuideText}`;
}

/**
 * Default FAQ questions for products
 */
export const DEFAULT_PRODUCT_FAQS: FAQItem[] = [
  {
    question: 'How long does delivery take in Sri Lanka?',
    answer: 'Delivery takes 10–20 working days for pre-orders. We deliver islandwide to all major cities including Colombo, Kandy, Galle, and Jaffna.',
  },
  {
    question: 'Is this jersey original or a replica?',
    answer: 'We offer premium replica jerseys with high-quality materials and authentic designs. These are not official licensed products but are made with Dri-Fit comfort and professional printing.',
  },
  {
    question: 'Can I add name and number?',
    answer: 'Yes! You can customize your jersey with any name and number during checkout. Additional customization fees may apply.',
  },
  {
    question: 'Do you have cash on delivery?',
    answer: 'Yes, we offer cash on delivery (COD) for orders in Sri Lanka. You can also pay online via secure payment methods.',
  },
  {
    question: 'How do I choose the correct size?',
    answer: 'Check our size guide page for detailed measurements. We offer sizes S, M, L, XL, 2XL, and 3XL. If you\'re unsure, contact us for assistance.',
  },
  {
    question: 'Can I track my order?',
    answer: 'Yes, once your order is dispatched, you\'ll receive a tracking number. Use our Track Your Order page to monitor delivery status.',
  },
  {
    question: 'What if my size doesn\'t fit?',
    answer: 'We offer size exchanges within 7 days of delivery. Contact us with your order number to arrange an exchange. See our Returns Policy for details.',
  },
  {
    question: 'Do you deliver to Jaffna / Kandy / Galle?',
    answer: 'Yes, we deliver islandwide across Sri Lanka including Jaffna, Kandy, Galle, and all major cities. Delivery times may vary by location.',
  },
];

/**
 * Default FAQ for categories
 */
export const DEFAULT_CATEGORY_FAQS: FAQItem[] = [
  {
    question: 'What types of jerseys do you offer?',
    answer: 'We offer club jerseys, national team jerseys, retro jerseys, and kids sizes. All jerseys are available in multiple sizes with customization options.',
  },
  {
    question: 'How long is the delivery time?',
    answer: 'Pre-order jerseys take 10–20 working days for delivery. We ship islandwide across Sri Lanka.',
  },
  {
    question: 'Can I customize my jersey?',
    answer: 'Yes, you can add names and numbers to most jerseys. Customization options are available during checkout.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept online payments via secure checkout and cash on delivery (COD) for orders in Sri Lanka.',
  },
];

/**
 * Generate canonical URL (removes query params for filters)
 */
export function generateCanonicalUrl(path: string, baseUrl: string = 'https://signaturekits-website.vercel.app'): string {
  // Remove query params for canonical
  const cleanPath = path.split('?')[0];
  return `${baseUrl}${cleanPath}`;
}

/**
 * Check if page should be noindex
 */
export function shouldNoIndex(path: string): boolean {
  const noIndexPaths = [
    '/cart',
    '/checkout',
    '/account',
    '/track-order',
    '/search',
    '/admin',
  ];
  
  // Check if path starts with any noindex path
  if (noIndexPaths.some(p => path.startsWith(p))) {
    return true;
  }
  
  // Check for filter/sort query params
  if (path.includes('?sort=') || path.includes('?size=') || path.includes('?filter=')) {
    return true;
  }
  
  return false;
}

