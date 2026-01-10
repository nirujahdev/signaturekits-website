import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/wishlists/product/[id]
 * See who wishlisted a product
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();
    const { id } = params;

    const { data, error } = await supabase
      .from('customer_wishlists')
      .select(`
        *,
        customers (
          id,
          email,
          first_name,
          last_name,
          phone_number
        )
      `)
      .eq('product_id', id)
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error fetching product wishlist:', error);
      return NextResponse.json(
        { error: 'Failed to fetch wishlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      wishlists: data || [],
      count: data?.length || 0 
    });
  } catch (error: any) {
    console.error('Product wishlist API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

