import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/discount-codes/[id]
 * Get discount code details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();
    const { id } = params;

    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Discount code not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching discount code:', error);
      return NextResponse.json(
        { error: 'Failed to fetch discount code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ discount_code: data });
  } catch (error: any) {
    console.error('Get discount code error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/discount-codes/[id]
 * Update discount code
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();
    const { id } = params;
    const body = await req.json();

    // Check if exists
    const { data: existing } = await supabase
      .from('discount_codes')
      .select('id, code')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Discount code not found' },
        { status: 404 }
      );
    }

    // Check code uniqueness if code is being changed
    if (body.code && body.code.toUpperCase().trim() !== existing.code) {
      const { data: codeConflict } = await supabase
        .from('discount_codes')
        .select('id')
        .eq('code', body.code.toUpperCase().trim())
        .neq('id', id)
        .single();

      if (codeConflict) {
        return NextResponse.json(
          { error: 'A discount code with this code already exists' },
          { status: 400 }
        );
      }
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.code !== undefined) updateData.code = body.code.toUpperCase().trim();
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.discount_type !== undefined) updateData.discount_type = body.discount_type;
    if (body.discount_value !== undefined) updateData.discount_value = parseFloat(body.discount_value);
    if (body.minimum_order_value !== undefined) updateData.minimum_order_value = body.minimum_order_value ? parseFloat(body.minimum_order_value) : null;
    if (body.maximum_discount !== undefined) updateData.maximum_discount = body.maximum_discount ? parseFloat(body.maximum_discount) : null;
    if (body.usage_limit !== undefined) updateData.usage_limit = body.usage_limit ? parseInt(body.usage_limit) : null;
    if (body.user_limit !== undefined) updateData.user_limit = body.user_limit ? parseInt(body.user_limit) : null;
    if (body.valid_from !== undefined) updateData.valid_from = new Date(body.valid_from).toISOString();
    if (body.valid_until !== undefined) updateData.valid_until = new Date(body.valid_until).toISOString();
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
    if (body.applicable_categories !== undefined) updateData.applicable_categories = body.applicable_categories;
    if (body.applicable_products !== undefined) updateData.applicable_products = body.applicable_products;

    const { data, error } = await supabase
      .from('discount_codes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating discount code:', error);
      return NextResponse.json(
        { error: 'Failed to update discount code', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ discount_code: data });
  } catch (error: any) {
    console.error('Update discount code error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/discount-codes/[id]
 * Delete discount code
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();
    const { id } = params;

    const { data, error } = await supabase
      .from('discount_codes')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Discount code not found' },
          { status: 404 }
        );
      }
      console.error('Error deleting discount code:', error);
      return NextResponse.json(
        { error: 'Failed to delete discount code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Discount code deleted successfully',
      discount_code: data 
    });
  } catch (error: any) {
    console.error('Delete discount code error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

