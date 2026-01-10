import { NextRequest, NextResponse } from 'next/server';
import { syncProduct } from '@/lib/typesense-sync';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/typesense/sync-product/[id]
 * Manually sync a product to Typesense
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await syncProduct(id);
    return NextResponse.json({ success: true, message: 'Product synced successfully' });
  } catch (error: any) {
    console.error('Sync product error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync product' },
      { status: 500 }
    );
  }
}

