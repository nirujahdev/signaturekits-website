/**
 * SEO Configuration Variables
 * Centralized configuration for SEO content variables
 * Update these values to match your actual business operations
 */

export const SEO_CONFIG = {
  // Delivery window (update based on your actual delivery times)
  DELIVERY_WINDOW: '10–20 working days',
  
  // Same-day delivery in Colombo (true/false)
  COLOMBO_SAME_DAY: false,
  
  // Cash on Delivery availability (true/false)
  COD: true,
  
  // Custom name & number availability (true/false)
  CUSTOM_NAME_NUMBER: true,
  
  // Tracking stage when tracking number is provided
  TRACKING_STAGE: 'Dispatched',
  
  // Base URL for canonical links
  BASE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://signaturekits-website.vercel.app',
  
  // Brand name
  BRAND_NAME: 'Signature Kits',
} as const;

/**
 * Helper function to replace variables in content strings
 */
export function replaceVariables(text: string): string {
  return text
    .replace(/{DELIVERY_WINDOW}/g, SEO_CONFIG.DELIVERY_WINDOW)
    .replace(/{COLOMBO_SAME_DAY}/g, SEO_CONFIG.COLOMBO_SAME_DAY ? 'Yes' : 'No')
    .replace(/{COD}/g, SEO_CONFIG.COD ? 'Yes' : 'No')
    .replace(/{CUSTOM_NAME_NUMBER}/g, SEO_CONFIG.CUSTOM_NAME_NUMBER ? 'Yes' : 'No')
    .replace(/{TRACKING_STAGE}/g, SEO_CONFIG.TRACKING_STAGE)
    .replace(/{BRAND}/g, SEO_CONFIG.BRAND_NAME);
}

