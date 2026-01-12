/**
 * Diagnostic Script: Product Visibility Issues
 * Checks all connections between Admin Dashboard → Supabase → Frontend
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

console.log('\n=== PRODUCT VISIBILITY DIAGNOSTIC ===\n');

async function main() {
  // 1. Check Environment Variables
  console.log('1. CHECKING ENVIRONMENT VARIABLES...');
  console.log('   SUPABASE_URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('   SERVICE_ROLE_KEY:', SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing');
  console.log('   ANON_KEY:', SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !SUPABASE_ANON_KEY) {
    console.error('\n❌ Missing required environment variables!');
    process.exit(1);
  }

  // 2. Test Admin Connection (Service Role)
  console.log('\n2. TESTING ADMIN CONNECTION (Service Role)...');
  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  const { data: adminProducts, error: adminError, count: adminCount } = await adminClient
    .from('products')
    .select('*', { count: 'exact' });

  if (adminError) {
    console.error('   ❌ Admin query failed:', adminError.message);
  } else {
    console.log(`   ✅ Admin can see ${adminCount} products (total)`);
    console.log(`   - Active: ${adminProducts?.filter(p => p.is_active).length || 0}`);
    console.log(`   - Inactive: ${adminProducts?.filter(p => !p.is_active).length || 0}`);
  }

  // 3. Test Public Connection (Anon Key)
  console.log('\n3. TESTING PUBLIC CONNECTION (Anon Key)...');
  const publicClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  const { data: publicProducts, error: publicError, count: publicCount } = await publicClient
    .from('products')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  if (publicError) {
    console.error('   ❌ Public query failed:', publicError.message);
    console.error('   → This might be an RLS (Row Level Security) policy issue');
  } else {
    console.log(`   ✅ Public can see ${publicCount} active products`);
  }

  // 4. Check Specific Product (AC Milan)
  console.log('\n4. CHECKING SPECIFIC PRODUCT (AC MILAN)...');
  const { data: acMilan, error: acMilanError } = await adminClient
    .from('products')
    .select('*')
    .ilike('title', '%AC Milan%')
    .single();

  if (acMilanError) {
    console.error('   ❌ AC Milan product not found:', acMilanError.message);
  } else if (acMilan) {
    console.log(`   ✅ Found: "${acMilan.title}"`);
    console.log(`   - ID: ${acMilan.id}`);
    console.log(`   - Slug: ${acMilan.slug || 'NOT SET'}`);
    console.log(`   - Active: ${acMilan.is_active ? '✅ YES' : '❌ NO'}`);
    console.log(`   - Price: ${acMilan.price} ${acMilan.currency_code}`);
    console.log(`   - Images: ${acMilan.images?.length || 0} images`);
    console.log(`   - Sizes: ${acMilan.sizes?.join(', ') || 'None'}`);
    console.log(`   - Categories: ${acMilan.categories?.join(', ') || 'None'}`);
    console.log(`   - Tags: ${acMilan.tags?.join(', ') || 'None'}`);
    
    // Check if public can see it
    const { data: publicAcMilan, error: publicAcMilanError } = await publicClient
      .from('products')
      .select('*')
      .eq('id', acMilan.id)
      .eq('is_active', true)
      .single();
    
    if (publicAcMilanError) {
      console.log(`   ⚠️  Public CANNOT see this product: ${publicAcMilanError.message}`);
    } else if (publicAcMilan) {
      console.log(`   ✅ Public CAN see this product`);
    }
  }

  // 5. Check RLS Policies
  console.log('\n5. CHECKING RLS POLICIES ON PRODUCTS TABLE...');
  const { data: rlsPolicies } = await adminClient
    .from('pg_policies')
    .select('*')
    .eq('tablename', 'products');

  if (rlsPolicies && rlsPolicies.length > 0) {
    console.log(`   Found ${rlsPolicies.length} RLS policies:`);
    rlsPolicies.forEach((policy: any) => {
      console.log(`   - ${policy.policyname}: ${policy.cmd} (${policy.roles?.join(', ') || 'no roles'})`);
    });
  } else {
    console.log('   ⚠️  No RLS policies found (or query not supported)');
  }

  // 6. Check Table Structure
  console.log('\n6. CHECKING TABLE STRUCTURE...');
  const { data: tableInfo, error: tableError } = await adminClient
    .from('products')
    .select('*')
    .limit(1);

  if (tableInfo && tableInfo.length > 0) {
    const columns = Object.keys(tableInfo[0]);
    console.log(`   Table has ${columns.length} columns:`);
    console.log(`   ${columns.join(', ')}`);
    
    // Check for required fields
    const requiredFields = ['id', 'title', 'slug', 'price', 'is_active', 'images', 'sizes', 'categories', 'tags'];
    const missingFields = requiredFields.filter(f => !columns.includes(f));
    
    if (missingFields.length > 0) {
      console.log(`   ❌ Missing fields: ${missingFields.join(', ')}`);
    } else {
      console.log(`   ✅ All required fields present`);
    }
  }

  // 7. Test API Routes (if running locally)
  console.log('\n7. TESTING API ROUTES...');
  try {
    // Test public products API
    const publicApiResponse = await fetch('http://localhost:3000/api/products?limit=10');
    if (publicApiResponse.ok) {
      const publicApiData = await publicApiResponse.json();
      console.log(`   ✅ GET /api/products: ${publicApiData.products?.items?.length || 0} products`);
    } else {
      console.log(`   ⚠️  GET /api/products: ${publicApiResponse.status} ${publicApiResponse.statusText}`);
    }
  } catch (error: any) {
    console.log(`   ⚠️  API route test skipped (dev server not running): ${error.message}`);
  }

  // 8. Summary
  console.log('\n=== DIAGNOSTIC SUMMARY ===\n');
  
  if (adminError || publicError) {
    console.log('❌ CONNECTION ISSUES FOUND');
    if (adminError) console.log('   - Admin connection failed');
    if (publicError) console.log('   - Public connection failed (possible RLS issue)');
  } else {
    console.log('✅ DATABASE CONNECTIONS OK');
  }

  if (adminCount !== publicCount) {
    console.log(`⚠️  VISIBILITY MISMATCH: Admin sees ${adminCount}, Public sees ${publicCount}`);
    console.log('   → Check is_active status and RLS policies');
  } else {
    console.log('✅ VISIBILITY CONSISTENT');
  }

  console.log('\n=== RECOMMENDATIONS ===\n');
  
  if (publicError?.message?.includes('policy')) {
    console.log('1. RLS POLICY ISSUE DETECTED');
    console.log('   Run this SQL in Supabase SQL Editor:');
    console.log('   ```sql');
    console.log('   -- Enable public read access to active products');
    console.log('   CREATE POLICY "Public products are viewable by everyone"');
    console.log('     ON products FOR SELECT');
    console.log('     TO anon, authenticated');
    console.log('     USING (is_active = true);');
    console.log('   ```\n');
  }

  if (adminProducts && adminProducts.some(p => !p.is_active)) {
    console.log('2. INACTIVE PRODUCTS FOUND');
    console.log('   - Check admin dashboard to verify product is marked as "Active"');
    console.log('   - Update products via: Admin > Products > Edit > Active checkbox\n');
  }

  if (adminProducts && adminProducts.some(p => !p.slug)) {
    console.log('3. MISSING SLUGS DETECTED');
    console.log('   - Some products do not have slugs');
    console.log('   - Slugs are required for product URLs\n');
  }

  console.log('=== END DIAGNOSTIC ===\n');
}

main().catch(console.error);

