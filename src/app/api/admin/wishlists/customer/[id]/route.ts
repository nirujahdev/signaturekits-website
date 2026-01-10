import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/wishlists/customer/[id]
 * Get customer's wishlist
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
        products (
          id,
          title,
          slug,
          price,
          images
        )
      `)
      .eq('customer_id', id)
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error fetching customer wishlist:', error);
      return NextResponse.json(
        { error: 'Failed to fetch wishlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({ wishlist: data || [] });
  } catch (error: any) {
    console.error('Customer wishlist API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

