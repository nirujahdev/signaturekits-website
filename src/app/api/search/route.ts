import { NextRequest, NextResponse } from 'next/server';
import Typesense from 'typesense';

const typesenseClient = process.env.TYPESENSE_HOST
  ? new Typesense.Client({
      nodes: [
        {
          host: process.env.TYPESENSE_HOST!,
          port: parseInt(process.env.TYPESENSE_PORT || '443'),
          protocol: (process.env.TYPESENSE_PROTOCOL || 'https') as 'http' | 'https',
        },
      ],
      apiKey: process.env.TYPESENSE_API_KEY!,
      connectionTimeoutSeconds: 2,
    })
  : null;

export async function POST(req: NextRequest) {
  if (!typesenseClient) {
    return NextResponse.json(
      { error: 'Typesense not configured' },
      { status: 503 }
    );
  }

  try {
    const { query, filters } = await req.json();

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

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: error.message || 'Search failed' },
      { status: 500 }
    );
  }
}

