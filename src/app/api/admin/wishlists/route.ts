import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/wishlists
 * List all wishlists with filters
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const searchParams = req.nextUrl.searchParams;
    const customerId = searchParams.get('customer_id');
    const productId = searchParams.get('product_id');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('customer_wishlists')
      .select(`
        *,
        customers (
          id,
          email,
          first_name,
          last_name,
          phone_number
        ),
        products (
          id,
          title,
          slug,
          price
        )
      `, { count: 'exact' })
      .order('added_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching wishlists:', error);
      return NextResponse.json(
        { error: 'Failed to fetch wishlists' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      wishlists: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Wishlists API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

