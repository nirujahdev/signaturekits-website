import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';
import { generateSlug, validateProduct } from '@/lib/products';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/products/[id]
 * Get single product by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();
    const { id } = params;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching product:', error);
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ product: data });
  } catch (error: any) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/products/[id]
 * Update product
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();
    const { id } = params;
    const body = await req.json();

    // Check if product exists
    const { data: existing } = await supabase
      .from('products')
      .select('id, slug')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Generate slug if title changed
    let slug = body.slug || existing.slug;
    if (body.title && body.title !== existing.slug) {
      slug = generateSlug(body.title);
      
      // Check if new slug conflicts with another product
      if (slug !== existing.slug) {
        const { data: slugConflict } = await supabase
          .from('products')
          .select('id')
          .eq('slug', slug)
          .neq('id', id)
          .single();

        if (slugConflict) {
          return NextResponse.json(
            { error: 'A product with this slug already exists' },
            { status: 400 }
          );
        }
      }
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined || body.title !== undefined) updateData.slug = slug;
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.currency_code !== undefined) updateData.currency_code = body.currency_code;
    if (body.sizes !== undefined) updateData.sizes = body.sizes;
    if (body.sku !== undefined) updateData.sku = body.sku || null;
    if (body.categories !== undefined) updateData.categories = body.categories;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured;

    // Validate if price is being updated
    if (body.price !== undefined) {
      const validation = validateProduct(updateData);
      if (!validation.valid) {
        return NextResponse.json(
          { error: 'Validation failed', errors: validation.errors },
          { status: 400 }
        );
      }
    }

    // Update product
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return NextResponse.json(
        { error: 'Failed to update product', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ product: data });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products/[id]
 * Soft delete product (set is_active=false)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();
    const { id } = params;

    // Check if product exists
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting is_active=false
    const { data, error } = await supabase
      .from('products')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ product: data, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

