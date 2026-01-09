import { GraphQLClient } from 'graphql-request';

const VENDURE_API_URL = process.env.NEXT_PUBLIC_VENDURE_API_URL || 'http://localhost:3000/shop-api';

/**
 * Vendure GraphQL Client
 * Handles all communication with Vendure Shop API
 */
export const vendureClient = new GraphQLClient(VENDURE_API_URL, {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Execute GraphQL query
 */
export async function vendureQuery<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  try {
    const data = await vendureClient.request<T>(query, variables);
    return data;
  } catch (error: any) {
    console.error('Vendure GraphQL Error:', error);
    throw new Error(error.response?.errors?.[0]?.message || error.message || 'GraphQL request failed');
  }
}

/**
 * Get or create active order (cart)
 */
export async function getActiveOrder(): Promise<string | null> {
  try {
    const query = `
      query GetActiveOrder {
        activeOrder {
          id
          code
          state
          totalWithTax
          currencyCode
          lines {
            id
            quantity
            productVariant {
              id
              name
              sku
              priceWithTax
              product {
                id
                name
                slug
                featuredAsset {
                  preview
                }
              }
            }
            customFields {
              patchEnabled
              patchType
              printName
              printNumber
            }
          }
        }
      }
    `;
    
    const data = await vendureQuery<{ activeOrder: any }>(query);
    return data.activeOrder?.id || null;
  } catch (error) {
    console.error('Error getting active order:', error);
    return null;
  }
}

