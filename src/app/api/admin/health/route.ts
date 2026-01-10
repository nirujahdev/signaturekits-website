import { NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

const REQUIRED_TABLES = [
  'customers',
  'customer_orders_summary',
  'customer_order_items',
  'customer_addresses',
  'order_delivery_status',
  'import_batches',
  'admin_users',
];

export async function GET() {
  try {
    const supabase = getAdminSupabaseClient();
    const health: {
      status: 'healthy' | 'degraded' | 'unhealthy';
      connection: boolean;
      tables: Record<string, { exists: boolean; rowCount: number }>;
      errors: string[];
    } = {
      status: 'healthy',
      connection: false,
      tables: {},
      errors: [],
    };

    // Test connection
    try {
      const { data, error } = await supabase.from('admin_users').select('id').limit(1);
      if (error) {
        health.errors.push(`Connection test failed: ${error.message}`);
        health.status = 'unhealthy';
      } else {
        health.connection = true;
      }
    } catch (error: any) {
      health.errors.push(`Connection error: ${error.message}`);
      health.status = 'unhealthy';
      return NextResponse.json(health, { status: 503 });
    }

    // Check each required table
    for (const tableName of REQUIRED_TABLES) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (error) {
          health.tables[tableName] = { exists: false, rowCount: 0 };
          health.errors.push(`Table ${tableName}: ${error.message}`);
          health.status = health.status === 'healthy' ? 'degraded' : health.status;
        } else {
          health.tables[tableName] = { exists: true, rowCount: count || 0 };
        }
      } catch (error: any) {
        health.tables[tableName] = { exists: false, rowCount: 0 };
        health.errors.push(`Table ${tableName} check failed: ${error.message}`);
        health.status = 'degraded';
      }
    }

    // Check foreign key relationships
    try {
      // Test a join query to verify relationships
      const { error: joinError } = await supabase
        .from('customer_orders_summary')
        .select('customers(email)')
        .limit(1);

      if (joinError && !joinError.message.includes('0 rows')) {
        health.errors.push(`Foreign key check: ${joinError.message}`);
        health.status = health.status === 'healthy' ? 'degraded' : health.status;
      }
    } catch (error: any) {
      health.errors.push(`Foreign key check failed: ${error.message}`);
      health.status = 'degraded';
    }

    const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        connection: false,
        tables: {},
        errors: [`Health check failed: ${error.message}`],
      },
      { status: 503 }
    );
  }
}

