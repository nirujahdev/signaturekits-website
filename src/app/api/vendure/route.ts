import { NextRequest, NextResponse } from 'next/server';
import { vendureQuery } from '@/lib/vendure-client';
import { GET_PRODUCTS, GET_PRODUCT_BY_SLUG, GET_ACTIVE_ORDER } from '@/lib/vendure-queries';

/**
 * API route for Vendure GraphQL queries (server-side)
 * Used to avoid exposing Vendure API URL to client
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, variables } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const data = await vendureQuery(query, variables);
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Vendure API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

