/**
 * Server-side Vendure operations
 * Use in Server Components and API routes
 */
import { vendureQuery } from './vendure-client';
import {
  GET_PRODUCTS,
  GET_PRODUCT_BY_SLUG,
  GET_PRODUCT_BY_ID,
  GET_ACTIVE_ORDER,
} from './vendure-queries';

export async function getProducts(options?: {
  take?: number;
  skip?: number;
  filter?: any;
  sort?: any;
}) {
  try {
    const result = await vendureQuery<{
      products: {
        items: any[];
        totalItems: number;
      };
    }>(GET_PRODUCTS, { options: options || { take: 20 } });
    return result.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { items: [], totalItems: 0 };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const result = await vendureQuery<{ product: any }>(GET_PRODUCT_BY_SLUG, { slug });
    return result.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getProductById(id: string) {
  try {
    const result = await vendureQuery<{ product: any }>(GET_PRODUCT_BY_ID, { id });
    return result.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

