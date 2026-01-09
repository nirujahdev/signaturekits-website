import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const VENDURE_ADMIN_API = process.env.NEXT_PUBLIC_VENDURE_API_URL?.replace('/shop-api', '/admin-api') || 'http://localhost:3000/admin-api';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Complete seeding endpoint - seeds both Vendure and Supabase
 * POST /api/admin/seed-all
 * 
 * Body: { adminToken: string }
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SEED_TOKEN || 'dev-seed-token'}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { adminToken } = await req.json();
    if (!adminToken) {
      return NextResponse.json({ error: 'Admin token required' }, { status: 400 });
    }

    const results = {
      supabase: {
        batches: [],
        orderTracking: [],
        supplierLists: [],
      },
      vendure: {
        products: [],
        customers: [],
        errors: [],
      },
    };

    // 1. Seed Supabase - Create more batches
    const batchData = [
      {
        target_order_count: 20,
        status: 'collecting',
        notes: 'AC Milan jerseys batch',
      },
      {
        target_order_count: 15,
        status: 'orderedFromSupplier',
        notes: 'Manchester United batch',
        supplier_order_date: new Date().toISOString(),
        expected_arrival_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        target_order_count: 25,
        status: 'inTransit',
        notes: 'Barcelona batch',
        supplier_order_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        expected_arrival_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    for (const batch of batchData) {
      try {
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
        results.supabase.batches.push(data);
      } catch (error: any) {
        console.error('Batch creation error:', error);
      }
    }

    // 2. Seed Order Tracking
    const trackingData = [
      {
        vendure_order_id: 'ORD-001',
        tracking_number: 'TE-2024-001',
        carrier: 'Trans Express',
        status: 'confirmed',
        estimated_delivery_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        shipping_address: {
          address: '123 Main St, Colombo 05',
          city: 'Colombo',
          postalCode: '00500',
        },
      },
      {
        vendure_order_id: 'ORD-002',
        tracking_number: 'TE-2024-002',
        carrier: 'Trans Express',
        status: 'processing',
        estimated_delivery_date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
        shipping_address: {
          address: '456 Galle Road, Kandy',
          city: 'Kandy',
          postalCode: '20000',
        },
      },
      {
        vendure_order_id: 'ORD-003',
        carrier: 'Trans Express',
        status: 'pending',
        estimated_delivery_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        shipping_address: {
          address: '789 Negombo Road, Negombo',
          city: 'Negombo',
          postalCode: '11500',
        },
      },
    ];

    for (const tracking of trackingData) {
      try {
        const { data, error } = await supabase
          .from('order_tracking')
          .insert(tracking)
          .select()
          .single();

        if (error && !error.message.includes('duplicate')) throw error;
        if (data) results.supabase.orderTracking.push(data);
      } catch (error: any) {
        console.error('Tracking creation error:', error);
      }
    }

    // 3. Seed Supplier Purchase Lists
    if (results.supabase.batches.length > 0) {
      const batchId = results.supabase.batches[0].id;
      const supplierData = [
        {
          batch_id: batchId,
          product_sku: 'ACM-HOME',
          variant_sku: 'ACM-HOME-M',
          size: 'Medium',
          quantity: 5,
          patch_enabled: true,
          patch_type: 'Champions League',
          print_name: 'KAKA',
          print_number: '22',
        },
        {
          batch_id: batchId,
          product_sku: 'MU-HOME',
          variant_sku: 'MU-HOME-L',
          size: 'Large',
          quantity: 3,
          patch_enabled: false,
          print_name: 'RONALDO',
          print_number: '7',
        },
      ];

      for (const item of supplierData) {
        try {
          const { data, error } = await supabase
            .from('supplier_purchase_lists')
            .insert(item)
            .select()
            .single();

          if (error) throw error;
          results.supabase.supplierLists.push(data);
        } catch (error: any) {
          console.error('Supplier list error:', error);
        }
      }
    }

    // 4. Seed Vendure Products
    const products = [
      {
        translations: [{
          languageCode: 'en',
          name: 'AC Milan 06/07 Home Jersey',
          slug: 'ac-milan-06-07-home',
          description: 'Classic AC Milan home jersey from the 2006/07 season.',
        }],
        customFields: {
          team: 'AC Milan',
          season: '2006/07',
          type: 'home',
          category: 'club',
        },
        variants: [
          { name: 'Small', sku: 'ACM-HOME-S', price: 4500, stockLevel: 'IN_STOCK' },
          { name: 'Medium', sku: 'ACM-HOME-M', price: 4500, stockLevel: 'IN_STOCK' },
          { name: 'Large', sku: 'ACM-HOME-L', price: 4500, stockLevel: 'IN_STOCK' },
        ],
      },
      {
        translations: [{
          languageCode: 'en',
          name: 'Manchester United 08/09 Home Jersey',
          slug: 'manchester-united-08-09-home',
          description: 'Iconic Manchester United home jersey from the 2008/09 season.',
        }],
        customFields: {
          team: 'Manchester United',
          season: '2008/09',
          type: 'home',
          category: 'club',
        },
        variants: [
          { name: 'Small', sku: 'MU-HOME-S', price: 4800, stockLevel: 'IN_STOCK' },
          { name: 'Medium', sku: 'MU-HOME-M', price: 4800, stockLevel: 'IN_STOCK' },
          { name: 'Large', sku: 'MU-HOME-L', price: 4800, stockLevel: 'IN_STOCK' },
        ],
      },
    ];

    const CREATE_PRODUCT = `
      mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
          id
          name
          slug
        }
      }
    `;

    for (const product of products) {
      try {
        const response = await fetch(`${VENDURE_ADMIN_API}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            query: CREATE_PRODUCT,
            variables: { input: product },
          }),
        });

        const data = await response.json();
        if (data.errors) {
          results.vendure.errors.push({ product: product.translations[0].name, error: data.errors[0].message });
        } else {
          results.vendure.products.push(data.data.createProduct);
        }
      } catch (error: any) {
        results.vendure.errors.push({ product: product.translations[0].name, error: error.message });
      }
    }

    // 5. Seed Vendure Customers
    const customers = [
      {
        firstName: 'Kamal',
        lastName: 'Perera',
        emailAddress: 'kamal.perera@example.com',
        phoneNumber: '94771234567',
        customFields: {
          phoneNumber: '94771234567',
          phoneVerified: true,
        },
      },
      {
        firstName: 'Nimal',
        lastName: 'Fernando',
        emailAddress: 'nimal.fernando@example.com',
        phoneNumber: '94772345678',
        customFields: {
          phoneNumber: '94772345678',
          phoneVerified: true,
        },
      },
    ];

    const CREATE_CUSTOMER = `
      mutation CreateCustomer($input: CreateCustomerInput!) {
        createCustomer(input: $input) {
          id
          emailAddress
        }
      }
    `;

    for (const customer of customers) {
      try {
        const response = await fetch(`${VENDURE_ADMIN_API}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            query: CREATE_CUSTOMER,
            variables: { input: customer },
          }),
        });

        const data = await response.json();
        if (data.errors) {
          results.vendure.errors.push({ customer: customer.emailAddress, error: data.errors[0].message });
        } else {
          results.vendure.customers.push(data.data.createCustomer);
        }
      } catch (error: any) {
        results.vendure.errors.push({ customer: customer.emailAddress, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Complete database seeding finished',
      results,
    });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: error.message || 'Seeding failed' },
      { status: 500 }
    );
  }
}

