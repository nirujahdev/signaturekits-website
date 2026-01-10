import { NextRequest, NextResponse } from 'next/server';

/**
 * API route for Vendure GraphQL queries - STUBBED OUT
 * Vendure has been removed. This route returns empty data to prevent errors.
 */
export async function POST(req: NextRequest) {
  // Return empty data instead of trying to connect to Vendure
  console.warn('Vendure API route called but Vendure is removed');
  return NextResponse.json({ data: null }, { status: 200 });
}

