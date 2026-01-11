import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const dynamic = 'force-dynamic';

/**
 * GET /api/products
 * Public API for fetching products (no auth required)
 * Supports filtering by categories, tags, and search
 */
export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const tag = searchParams.get('tag') || '';
    const collection = searchParams.get('collection') || '';

    // Build query - only fetch active products
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply category filter
    if (category) {
      query = query.contains('categories', [category]);
    }

    // Apply tag filter
    if (tag) {
      query = query.contains('tags', [tag]);
    }

    // Apply collection filter (map collection slug to category/tag)
    if (collection) {
      const collectionMap: Record<string, string> = {
        'retro': 'retro',
        'club': 'club',
        'club-jerseys': 'club',
        'country': 'country',
        'national-team-jerseys': 'country',
        'kids': 'kids',
        'player-version': 'player-version',
        'special-editions': 'special-editions',
        'custom-name-number': 'custom-name-number',
        'sri-lanka-jerseys': 'sri-lanka-jerseys',
        'master': 'master',
      };

      const mappedCollection = collectionMap[collection] || collection;
      
      // Filter by category or tag containing the collection value
      query = query.or(`categories.cs.{${mappedCollection}},tags.cs.{${mappedCollection}}`);
    }

    // Apply pagination
    query = query.range(skip, skip + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Transform Supabase products to frontend format
    const transformedProducts = (data || []).map((product) => ({
      id: product.id,
      name: product.title,
      slug: product.slug || product.id,
      description: product.description || '',
      featuredAsset: {
        preview: product.images && product.images.length > 0 ? product.images[0] : '/placeholder-jersey.jpg',
        source: product.images && product.images.length > 0 ? product.images[0] : '/placeholder-jersey.jpg',
      },
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
          priceWithTax: Math.round((product.price || 0) * 100), // Convert to cents
          price: Math.round((product.price || 0) * 100),
          currencyCode: product.currency_code || 'LKR',
          stockLevel: 'IN_STOCK', // Default to in stock
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
    }));

    return NextResponse.json({
      products: {
        items: transformedProducts,
        totalItems: count || 0,
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

