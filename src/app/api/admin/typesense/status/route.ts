import { NextResponse } from 'next/server';
import { checkSyncStatus } from '@/lib/typesense-sync';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/typesense/status
 * Get Typesense sync status
 */
export async function GET() {
  try {
    const status = await checkSyncStatus();
    return NextResponse.json({ status });
  } catch (error: any) {
    console.error('Typesense status error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

