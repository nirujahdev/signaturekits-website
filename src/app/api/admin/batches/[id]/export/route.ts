import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();

    // Get supplier purchase list
    const { data: supplierList } = await supabase
      .from('supplier_purchase_lists')
      .select('*')
      .eq('batch_id', params.id);

    if (!supplierList || supplierList.length === 0) {
      return NextResponse.json(
        { error: 'No supplier list found for this batch' },
        { status: 404 }
      );
    }

    // Convert to CSV
    const headers = [
      'Product SKU',
      'Variant SKU',
      'Size',
      'Quantity',
      'Patch Enabled',
      'Patch Type',
      'Print Name',
      'Print Number',
    ];

    const rows = supplierList.map((item) => [
      item.product_sku || '',
      item.variant_sku || '',
      item.size || '',
      item.quantity || 0,
      item.patch_enabled ? 'Yes' : 'No',
      item.patch_type || '',
      item.print_name || '',
      item.print_number || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="batch-${params.id}-supplier-list.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

