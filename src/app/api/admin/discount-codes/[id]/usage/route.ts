import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/discount-codes/[id]/usage
 * Get usage history for a discount code
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();
    const { id } = params;
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get usage records
    const { data: usage, error } = await supabase
      .from('discount_code_usage')
      .select(`
        *,
        customers (
          id,
          email,
          first_name,
          last_name
        )
      `)
      .eq('discount_code_id', id)
      .order('used_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching discount code usage:', error);
      return NextResponse.json(
        { error: 'Failed to fetch usage history' },
        { status: 500 }
      );
    }

    // Get discount code details
    const { data: discountCode } = await supabase
      .from('discount_codes')
      .select('code, usage_limit, usage_count')
      .eq('id', id)
      .single();

    return NextResponse.json({
      usage: usage || [],
      discount_code: discountCode,
      total_usage: usage?.length || 0,
    });
  } catch (error: any) {
    console.error('Get discount code usage error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

