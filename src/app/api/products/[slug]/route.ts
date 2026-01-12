import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const dynamic = 'force-dynamic';

/**
 * GET /api/products/[slug]
 * Get a single product by slug or ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { slug } = params;

    // Try to find by slug first, then by ID
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .limit(1);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching product:', error);
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { product: null },
        { status: 404 }
      );
    }

    const product = data[0];

    // Transform to frontend format
    const transformedProduct = {
      id: product.id,
      name: product.title,
      slug: product.slug || product.id,
      description: product.description || '',
      assets: (product.images || []).map((img: string) => ({
        id: img,
        preview: img,
        source: img,
      })),
      variants: [
        {
          id: product.id,
          name: 'Default',
          sku: product.sku || product.id,
          priceWithTax: Math.round((product.price || 0) * 100),
          price: Math.round((product.price || 0) * 100),
          currencyCode: product.currency_code || 'LKR',
          stockLevel: 'IN_STOCK',
          options: [],
        },
      ],
      facetValues: [
        ...(product.categories || []).map((cat: string) => ({
          id: cat,
          name: cat,
          code: cat.toLowerCase().replace(/\s+/g, '-'),
          facet: {
            id: 'category',
            name: 'Category',
            code: 'category',
          },
        })),
        ...(product.tags || []).map((tag: string) => ({
          id: tag,
          name: tag,
          code: tag.toLowerCase().replace(/\s+/g, '-'),
          facet: {
            id: 'tag',
            name: 'Tag',
            code: 'tag',
          },
        })),
      ],
    };

    return NextResponse.json({ product: transformedProduct });
  } catch (error: any) {
    console.error('Product API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

