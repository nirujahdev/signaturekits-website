/**
 * Vendure GraphQL Client - STUBBED OUT
 * Vendure has been removed. This file provides stub implementations
 * to prevent errors while the frontend is being migrated to Supabase.
 */

/**
 * Execute GraphQL query - STUBBED
 * Returns empty data to prevent errors
 */
export async function vendureQuery<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  // Return empty data instead of throwing errors
  console.warn('Vendure GraphQL query called but Vendure is removed. Returning empty data.');
  return {} as T;
}

/**
 * Get or create active order (cart) - STUBBED
 * Returns null to indicate no active order
 */
export async function getActiveOrder(): Promise<string | null> {
  // Return null instead of trying to connect to Vendure
  return null;
}

