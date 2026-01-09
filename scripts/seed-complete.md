# Complete Database Seeding Guide

This guide explains how to seed your Vendure and Supabase databases with sample data.

## Prerequisites

1. Vendure server running at `http://localhost:3000`
2. Admin user created in Vendure
3. Admin API token obtained from Vendure Admin UI
4. Supabase MCP connected and configured

## Method 1: Using API Endpoints

### Step 1: Get Admin Token

1. Start Vendure: `npm run vendure:dev`
2. Access Admin UI: http://localhost:3000/admin
3. Login and go to Settings → API Tokens
4. Create a new token or use existing one

### Step 2: Seed All Data

```bash
curl -X POST http://localhost:3000/api/admin/seed-all \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-seed-token" \
  -d '{"adminToken": "YOUR_ADMIN_TOKEN_HERE"}'
```

This will seed:
- ✅ Supabase: Import batches, order tracking, supplier purchase lists
- ✅ Vendure: Products, customers

## Method 2: Using Supabase MCP (Already Done)

The following data has been created via MCP:
- ✅ 2 sample import batches
- ✅ 3 sample order tracking records
- ✅ Sample supplier purchase lists

## Method 3: Manual Seeding via Vendure Admin UI

### Create Products

1. Go to Products → Create Product
2. Fill in:
   - Name: "AC Milan 06/07 Home Jersey"
   - Slug: "ac-milan-06-07-home"
   - Description: "Classic AC Milan home jersey"
   - Custom Fields:
     - Team: "AC Milan"
     - Season: "2006/07"
     - Type: "home"
     - Category: "club"
3. Add Variants:
   - Small (SKU: ACM-HOME-S, Price: 4500)
   - Medium (SKU: ACM-HOME-M, Price: 4500)
   - Large (SKU: ACM-HOME-L, Price: 4500)

### Create Customers

1. Go to Customers → Create Customer
2. Fill in:
   - First Name: "Kamal"
   - Last Name: "Perera"
   - Email: "kamal.perera@example.com"
   - Phone: "94771234567"
   - Custom Fields:
     - Phone Number: "94771234567"
     - Phone Verified: true

### Create Orders

1. Go to Orders → Create Order
2. Select customer
3. Add product variants
4. Set shipping method (Trans Express)
5. Set payment method (PayHere or COD)
6. Complete order

## Verify Data

### Check Supabase Tables

```sql
-- Check batches
SELECT * FROM import_batches;

-- Check order tracking
SELECT * FROM order_tracking;

-- Check supplier lists
SELECT * FROM supplier_purchase_lists;

-- Check OTP sessions
SELECT * FROM otp_sessions;
```

### Check Vendure Data

1. Admin UI → Products (should see seeded products)
2. Admin UI → Customers (should see seeded customers)
3. Admin UI → Orders (create test orders)

## Next Steps

After seeding:
1. ✅ Products are available in storefront
2. ✅ Customers can place orders
3. ✅ Orders can be assigned to batches
4. ✅ Order tracking is functional
5. ✅ Supplier purchase lists can be exported

