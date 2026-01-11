import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';
import { generateSlug, validateProduct } from '@/lib/products';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/products
 * List all products with pagination, search, and filters
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const searchParams = req.nextUrl.searchParams;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const tag = searchParams.get('tag') || '';
    const isActive = searchParams.get('is_active');
    const isFeatured = searchParams.get('is_featured');

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category) {
      query = query.contains('categories', [category]);
    }

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    if (isActive !== null && isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true');
    }

    if (isFeatured !== null && isFeatured !== undefined) {
      query = query.eq('is_featured', isFeatured === 'true');
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      products: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products
 * Create new product
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getAdminSupabaseClient();

    // Generate slug from title
    const slug = body.slug || generateSlug(body.title);

    // Prepare product data
    const productData = {
      title: body.title,
      slug,
      description: body.description || null,
      price: parseFloat(body.price),
      currency_code: body.currency_code || 'LKR',
      sizes: body.sizes || [],
      sku: body.sku || null,
      categories: body.categories || [],
      tags: body.tags || [],
      images: body.images || [],
      is_active: body.is_active !== undefined ? body.is_active : true,
      is_featured: body.is_featured || false,
    };

    // Validate product data
    const validation = validateProduct(productData);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    // Insert product
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { error: 'Failed to create product', details: error.message },
        { status: 500 }
      );
    }

    // If product has temporary images, move them to product folder
    if (data.images && data.images.length > 0) {
      try {
        // Check if any images are in temp folder
        const hasTempImages = data.images.some((url: string) => url.includes('/temp/'));
        
        if (hasTempImages) {
          // Import the move function directly instead of making HTTP call
          const { moveTempImages } = await import('@/lib/supabase-storage');
          const moveResult = await moveTempImages(data.images, data.id);
          
          if (moveResult.success && moveResult.images) {
            // Update product with moved image URLs
            const { data: updatedProduct } = await supabase
              .from('products')
              .update({ images: moveResult.images })
              .eq('id', data.id)
              .select()
              .single();
            
            if (updatedProduct) {
              data.images = updatedProduct.images;
            }
          }
        }
      } catch (moveError) {
        console.error('Error moving temporary images:', moveError);
        // Don't fail product creation if image move fails
      }
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

