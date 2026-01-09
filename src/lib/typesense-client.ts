/**
 * Typesense Client for Frontend
 * Handles search queries from Next.js
 */
import Typesense from 'typesense';

let client: Typesense.Client | null = null;

export function getTypesenseClient(): Typesense.Client | null {
  if (typeof window === 'undefined') {
    // Server-side: use API route
    return null;
  }

  if (client) {
    return client;
  }

  const host = process.env.NEXT_PUBLIC_TYPESENSE_HOST;
  const port = process.env.NEXT_PUBLIC_TYPESENSE_PORT || '443';
  const protocol = process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || 'https';
  const apiKey = process.env.NEXT_PUBLIC_TYPESENSE_API_KEY;

  if (!host || !apiKey) {
    console.warn('Typesense not configured for frontend');
    return null;
  }

  client = new Typesense.Client({
    nodes: [
      {
        host,
        port: parseInt(port),
        protocol: protocol as 'http' | 'https',
      },
    ],
    apiKey,
    connectionTimeoutSeconds: 2,
  });

  return client;
}

export interface SearchFilters {
  team?: string;
  season?: string;
  type?: string;
  category?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
}

export async function searchProducts(
  query: string,
  filters?: SearchFilters
): Promise<{
  hits: Array<{
    document: {
      id: string;
      productId: string;
      name: string;
      slug: string;
      price: number;
      image: string;
      team?: string;
      season?: string;
      size?: string;
    };
  }>;
  found: number;
}> {
  const typesenseClient = getTypesenseClient();

  if (!typesenseClient) {
    // Fallback to API route
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, filters }),
    });
    return response.json();
  }

  try {
    const searchParameters: any = {
      q: query || '*',
      query_by: 'name,description,team,season',
      per_page: 20,
    };

    if (filters) {
      const filterBy: string[] = [];
      if (filters.team) filterBy.push(`team:${filters.team}`);
      if (filters.season) filterBy.push(`season:${filters.season}`);
      if (filters.type) filterBy.push(`type:${filters.type}`);
      if (filters.category) filterBy.push(`category:${filters.category}`);
      if (filters.size) filterBy.push(`size:${filters.size}`);
      if (filters.minPrice !== undefined) {
        filterBy.push(`price:>=${filters.minPrice}`);
      }
      if (filters.maxPrice !== undefined) {
        filterBy.push(`price:<=${filters.maxPrice}`);
      }
      if (filterBy.length > 0) {
        searchParameters.filter_by = filterBy.join(' && ');
      }
    }

    const results = await typesenseClient
      .collections('products')
      .documents()
      .search(searchParameters);

    return results as any;
  } catch (error) {
    console.error('Typesense search error:', error);
    return { hits: [], found: 0 };
  }
}

