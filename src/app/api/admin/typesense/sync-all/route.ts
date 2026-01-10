import { NextResponse } from 'next/server';
import { syncAllProducts } from '@/lib/typesense-sync';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/typesense/sync-all
 * Trigger full product sync to Typesense
 */
export async function POST() {
  try {
    await syncAllProducts();
    return NextResponse.json({ success: true, message: 'Full sync completed successfully' });
  } catch (error: any) {
    console.error('Full sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync all products' },
      { status: 500 }
    );
  }
}

