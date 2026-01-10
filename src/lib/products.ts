/**
 * Product Utilities
 * Helper functions for product management
 */

/**
 * Generate URL-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validate product data
 */
export interface ProductInput {
  title: string;
  description?: string;
  price: number;
  currency_code?: string;
  sizes?: string[];
  sku?: string;
  categories?: string[];
  tags?: string[];
  images?: string[];
}

export function validateProduct(data: Partial<ProductInput>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (data.title && data.title.length > 255) {
    errors.push('Title must be 255 characters or less');
  }

  if (data.price === undefined || data.price === null) {
    errors.push('Price is required');
  }

  if (data.price !== undefined && data.price < 0) {
    errors.push('Price must be greater than or equal to 0');
  }

  if (data.sku && data.sku.length > 255) {
    errors.push('SKU must be 255 characters or less');
  }

  if (data.currency_code && data.currency_code.length !== 3) {
    errors.push('Currency code must be 3 characters (e.g., LKR)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format price with currency
 */
export function formatPrice(price: number, currency: string = 'LKR'): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Available size options
 */
export const AVAILABLE_SIZES = [
  'S',
  'M',
  'L',
  'XL',
  '2XL',
  '3XL',
  '16',
  '18',
  '20',
  '22',
  '24',
  '26',
  '28',
  '30',
] as const;

export type Size = typeof AVAILABLE_SIZES[number];

/**
 * Check if size is valid
 */
export function isValidSize(size: string): boolean {
  return AVAILABLE_SIZES.includes(size as Size);
}

