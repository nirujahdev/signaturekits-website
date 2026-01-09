import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Admin API route to seed database with sample data
 * POST /api/admin/seed
 */
export async function POST(req: NextRequest) {
  try {
    // Verify admin access (add authentication in production)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SEED_TOKEN || 'dev-seed-token'}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize Supabase client at runtime (not build time)
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Create sample batches
    const batches = [
      {
        target_order_count: 20,
        status: 'collecting',
        notes: 'First batch for AC Milan jerseys',
      },
      {
        target_order_count: 15,
        status: 'orderedFromSupplier',
        notes: 'Manchester United batch',
        supplier_order_date: new Date().toISOString(),
      },
    ];

    const createdBatches = [];
    for (const batch of batches) {
      const { data: batchNumber } = await supabase.rpc('generate_batch_number');
      
      const { data, error } = await supabase
        .from('import_batches')
        .insert({
          batch_number: batchNumber,
          ...batch,
        })
        .select()
        .single();

      if (error) throw error;
      createdBatches.push(data);
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      batches: createdBatches,
    });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: error.message || 'Seeding failed' },
      { status: 500 }
    );
  }
}

