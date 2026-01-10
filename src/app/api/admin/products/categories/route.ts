import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';
import { generateSlug } from '@/lib/products';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/products/categories
 * List all categories
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const searchParams = req.nextUrl.searchParams;
    const isActive = searchParams.get('is_active');

    let query = supabase
      .from('product_categories')
      .select('*')
      .order('name', { ascending: true });

    if (isActive !== null && isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    return NextResponse.json({ categories: data || [] });
  } catch (error: any) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products/categories
 * Create new category
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getAdminSupabaseClient();

    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const slug = body.slug || generateSlug(body.name);

    // Check if category with same slug exists
    const { data: existing } = await supabase
      .from('product_categories')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    const categoryData = {
      name: body.name.trim(),
      slug,
      description: body.description || null,
      is_active: body.is_active !== undefined ? body.is_active : true,
    };

    const { data, error } = await supabase
      .from('product_categories')
      .insert(categoryData)
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return NextResponse.json(
        { error: 'Failed to create category', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ category: data }, { status: 201 });
  } catch (error: any) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

