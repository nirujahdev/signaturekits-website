import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/admin/wishlists/[id]
 * Remove item from wishlist (admin action)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();
    const { id } = params;

    const { data, error } = await supabase
      .from('customer_wishlists')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Wishlist item not found' },
          { status: 404 }
        );
      }
      console.error('Error deleting wishlist item:', error);
      return NextResponse.json(
        { error: 'Failed to delete wishlist item' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Wishlist item deleted successfully',
      wishlist: data 
    });
  } catch (error: any) {
    console.error('Delete wishlist error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

