import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/discount-codes
 * List all discount codes
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const searchParams = req.nextUrl.searchParams;
    const isActive = searchParams.get('is_active');

    let query = supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (isActive !== null && isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching discount codes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch discount codes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ discount_codes: data || [] });
  } catch (error: any) {
    console.error('Discount codes API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/discount-codes
 * Create new discount code
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getAdminSupabaseClient();

    // Validation
    if (!body.code || body.code.trim().length === 0) {
      return NextResponse.json(
        { error: 'Discount code is required' },
        { status: 400 }
      );
    }

    if (!body.discount_type || !['percentage', 'fixed'].includes(body.discount_type)) {
      return NextResponse.json(
        { error: 'Discount type must be "percentage" or "fixed"' },
        { status: 400 }
      );
    }

    if (!body.discount_value || body.discount_value <= 0) {
      return NextResponse.json(
        { error: 'Discount value must be greater than 0' },
        { status: 400 }
      );
    }

    if (body.discount_type === 'percentage' && body.discount_value > 100) {
      return NextResponse.json(
        { error: 'Percentage discount cannot exceed 100%' },
        { status: 400 }
      );
    }

    if (!body.valid_from || !body.valid_until) {
      return NextResponse.json(
        { error: 'Valid from and valid until dates are required' },
        { status: 400 }
      );
    }

    // Check if code already exists
    const { data: existing } = await supabase
      .from('discount_codes')
      .select('id')
      .eq('code', body.code.toUpperCase().trim())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'A discount code with this code already exists' },
        { status: 400 }
      );
    }

    const discountData = {
      code: body.code.toUpperCase().trim(),
      description: body.description || null,
      discount_type: body.discount_type,
      discount_value: parseFloat(body.discount_value),
      minimum_order_value: body.minimum_order_value ? parseFloat(body.minimum_order_value) : null,
      maximum_discount: body.maximum_discount ? parseFloat(body.maximum_discount) : null,
      usage_limit: body.usage_limit ? parseInt(body.usage_limit) : null,
      user_limit: body.user_limit ? parseInt(body.user_limit) : null,
      valid_from: new Date(body.valid_from).toISOString(),
      valid_until: new Date(body.valid_until).toISOString(),
      is_active: body.is_active !== undefined ? body.is_active : true,
      applicable_categories: body.applicable_categories || [],
      applicable_products: body.applicable_products || [],
    };

    const { data, error } = await supabase
      .from('discount_codes')
      .insert(discountData)
      .select()
      .single();

    if (error) {
      console.error('Error creating discount code:', error);
      return NextResponse.json(
        { error: 'Failed to create discount code', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ discount_code: data }, { status: 201 });
  } catch (error: any) {
    console.error('Create discount code error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

