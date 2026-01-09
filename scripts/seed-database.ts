/**
 * Database Seeding Script
 * Populates Vendure and Supabase with sample data
 * Run: npx ts-node scripts/seed-database.ts
 */

import { vendureQuery } from '../src/lib/vendure-client';
import { createClient } from '@supabase/supabase-js';

const VENDURE_ADMIN_API = process.env.NEXT_PUBLIC_VENDURE_API_URL?.replace('/shop-api', '/admin-api') || 'http://localhost:3000/admin-api';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Sample Products Data
const sampleProducts = [
  {
    name: 'AC Milan 06/07 Home Jersey',
    slug: 'ac-milan-06-07-home',
    description: 'Classic AC Milan home jersey from the 2006/07 season. Authentic design with premium materials.',
    assets: [],
    facetValueIds: [],
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
      { name: 'XL', sku: 'ACM-HOME-XL', price: 4500, stockLevel: 'IN_STOCK' },
    ],
  },
  {
    name: 'Manchester United 08/09 Home Jersey',
    slug: 'manchester-united-08-09-home',
    description: 'Iconic Manchester United home jersey from the 2008/09 season.',
    assets: [],
    facetValueIds: [],
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
  {
    name: 'Sri Lanka National Team 2024 Home',
    slug: 'sri-lanka-2024-home',
    description: 'Official Sri Lanka national team home jersey 2024.',
    assets: [],
    facetValueIds: [],
    customFields: {
      team: 'Sri Lanka',
      season: '2024',
      type: 'home',
      category: 'country',
    },
    variants: [
      { name: 'Small', sku: 'SL-HOME-S', price: 4200, stockLevel: 'IN_STOCK' },
      { name: 'Medium', sku: 'SL-HOME-M', price: 4200, stockLevel: 'IN_STOCK' },
      { name: 'Large', sku: 'SL-HOME-L', price: 4200, stockLevel: 'IN_STOCK' },
      { name: 'XL', sku: 'SL-HOME-XL', price: 4200, stockLevel: 'IN_STOCK' },
    ],
  },
  {
    name: 'Barcelona 10/11 Home Jersey',
    slug: 'barcelona-10-11-home',
    description: 'Retro Barcelona home jersey from the 2010/11 season.',
    assets: [],
    facetValueIds: [],
    customFields: {
      team: 'Barcelona',
      season: '2010/11',
      type: 'home',
      category: 'club',
    },
    variants: [
      { name: 'Small', sku: 'BAR-HOME-S', price: 4600, stockLevel: 'IN_STOCK' },
      { name: 'Medium', sku: 'BAR-HOME-M', price: 4600, stockLevel: 'IN_STOCK' },
      { name: 'Large', sku: 'BAR-HOME-L', price: 4600, stockLevel: 'IN_STOCK' },
    ],
  },
  {
    name: 'Real Madrid 11/12 Away Jersey',
    slug: 'real-madrid-11-12-away',
    description: 'Classic Real Madrid away jersey from the 2011/12 season.',
    assets: [],
    facetValueIds: [],
    customFields: {
      team: 'Real Madrid',
      season: '2011/12',
      type: 'away',
      category: 'club',
    },
    variants: [
      { name: 'Small', sku: 'RM-AWAY-S', price: 4700, stockLevel: 'IN_STOCK' },
      { name: 'Medium', sku: 'RM-AWAY-M', price: 4700, stockLevel: 'IN_STOCK' },
      { name: 'Large', sku: 'RM-AWAY-L', price: 4700, stockLevel: 'IN_STOCK' },
    ],
  },
];

// Sample Customers
const sampleCustomers = [
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
  {
    firstName: 'Samantha',
    lastName: 'Wijesinghe',
    emailAddress: 'samantha.w@example.com',
    phoneNumber: '94773456789',
    customFields: {
      phoneNumber: '94773456789',
      phoneVerified: false,
    },
  },
];

async function seedProducts() {
  console.log('🌱 Seeding products...');
  
  const CREATE_PRODUCT = `
    mutation CreateProduct($input: CreateProductInput!) {
      createProduct(input: $input) {
        id
        name
        slug
      }
    }
  `;

  for (const product of sampleProducts) {
    try {
      const result = await vendureQuery(CREATE_PRODUCT, {
        input: {
          translations: [{
            languageCode: 'en',
            name: product.name,
            slug: product.slug,
            description: product.description,
          }],
          customFields: product.customFields,
        },
      });
      console.log(`✅ Created product: ${product.name}`);
    } catch (error: any) {
      console.error(`❌ Error creating product ${product.name}:`, error.message);
    }
  }
}

async function seedCustomers() {
  console.log('🌱 Seeding customers...');
  
  const CREATE_CUSTOMER = `
    mutation CreateCustomer($input: CreateCustomerInput!) {
      createCustomer(input: $input) {
        id
        emailAddress
      }
    }
  `;

  for (const customer of sampleCustomers) {
    try {
      const result = await vendureQuery(CREATE_CUSTOMER, {
        input: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          emailAddress: customer.emailAddress,
          phoneNumber: customer.phoneNumber,
          customFields: customer.customFields,
        },
      });
      console.log(`✅ Created customer: ${customer.emailAddress}`);
    } catch (error: any) {
      console.error(`❌ Error creating customer ${customer.emailAddress}:`, error.message);
    }
  }
}

async function seedBatches() {
  console.log('🌱 Seeding import batches...');
  
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

  for (const batch of batches) {
    try {
      const { data, error } = await supabase.rpc('generate_batch_number');
      if (error) throw error;

      const { data: batchData, error: batchError } = await supabase
        .from('import_batches')
        .insert({
          batch_number: data,
          target_order_count: batch.target_order_count,
          status: batch.status,
          notes: batch.notes,
          supplier_order_date: batch.supplier_order_date || null,
        })
        .select()
        .single();

      if (batchError) throw batchError;
      console.log(`✅ Created batch: ${batchData.batch_number}`);
    } catch (error: any) {
      console.error(`❌ Error creating batch:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Starting database seeding...\n');
  
  try {
    await seedProducts();
    await seedCustomers();
    await seedBatches();
    
    console.log('\n✅ Database seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();

