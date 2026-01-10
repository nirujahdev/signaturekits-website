import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';
import { generateSlug } from '@/lib/products';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/products/tags
 * List all tags
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const searchParams = req.nextUrl.searchParams;
    const isActive = searchParams.get('is_active');

    let query = supabase
      .from('product_tags')
      .select('*')
      .order('name', { ascending: true });

    if (isActive !== null && isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tags:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tags' },
        { status: 500 }
      );
    }

    return NextResponse.json({ tags: data || [] });
  } catch (error: any) {
    console.error('Tags API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products/tags
 * Create new tag
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getAdminSupabaseClient();

    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }

    const slug = body.slug || generateSlug(body.name);

    // Check if tag with same slug exists
    const { data: existing } = await supabase
      .from('product_tags')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'A tag with this slug already exists' },
        { status: 400 }
      );
    }

    const tagData = {
      name: body.name.trim(),
      slug,
      is_active: body.is_active !== undefined ? body.is_active : true,
    };

    const { data, error } = await supabase
      .from('product_tags')
      .insert(tagData)
      .select()
      .single();

    if (error) {
      console.error('Error creating tag:', error);
      return NextResponse.json(
        { error: 'Failed to create tag', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ tag: data }, { status: 201 });
  } catch (error: any) {
    console.error('Create tag error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

