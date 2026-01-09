# Customer Data Structure

## Overview

All customer data is now stored in dedicated Supabase tables, separate from Vendure's internal tables. This provides:

- **Better Analytics**: Query customer data directly without Vendure API
- **Performance**: Denormalized tables for fast queries
- **Flexibility**: Custom fields and metadata
- **History**: Complete order and status history

## Tables Created

### 1. `customers` - Main Customer Table
Stores all customer information synced from Vendure.

**Key Features:**
- Unique `vendure_customer_id` links to Vendure
- Auto-calculated statistics (total_orders, total_spent)
- Marketing preferences and consent
- Custom fields (JSONB) for flexibility

**Example Query:**
```sql
SELECT 
  email,
  first_name,
  last_name,
  phone_number,
  phone_verified,
  total_orders,
  total_spent,
  last_order_date
FROM customers
WHERE is_active = TRUE
ORDER BY total_spent DESC;
```

### 2. `customer_addresses` - Multiple Addresses
Stores shipping and billing addresses per customer.

**Key Features:**
- Multiple addresses per customer
- Address types: shipping, billing, both
- Default address flag
- Links to Vendure addresses

**Example Query:**
```sql
SELECT 
  c.email,
  ca.full_name,
  ca.street_line1,
  ca.city,
  ca.is_default
FROM customers c
JOIN customer_addresses ca ON c.id = ca.customer_id
WHERE c.id = 'customer-uuid'
  AND ca.address_type = 'shipping';
```

### 3. `customer_orders_summary` - Order Overview
Denormalized order data for quick customer queries.

**Key Features:**
- One row per order
- Includes delivery stage, payment status
- Links to import batches
- Tracking information

**Example Query:**
```sql
SELECT 
  order_code,
  order_date,
  delivery_stage,
  total_with_tax,
  tracking_number,
  batch_number
FROM customer_orders_summary
WHERE customer_id = 'customer-uuid'
ORDER BY order_date DESC;
```

### 4. `customer_order_items` - Order Details
Detailed line items with customization.

**Key Features:**
- Product and variant information
- Customization (patch, name, number)
- Pricing details
- Links to order summary

**Example Query:**
```sql
SELECT 
  coi.product_name,
  coi.variant_name,
  coi.quantity,
  coi.line_total_with_tax,
  coi.patch_enabled,
  coi.print_name,
  coi.print_number
FROM customer_order_items coi
JOIN customer_orders_summary cos ON coi.order_summary_id = cos.id
WHERE cos.order_code = 'ORDER-123';
```

## Auto-Sync Mechanism

### CustomerSyncPlugin
Automatically syncs data from Vendure to Supabase:

1. **Customer Created/Updated**:
   - Syncs to `customers` table
   - Syncs addresses to `customer_addresses`

2. **Order Created/Updated**:
   - Syncs order to `customer_orders_summary`
   - Syncs line items to `customer_order_items`
   - Updates customer statistics automatically

### Statistics Auto-Update
The `update_customer_statistics()` function automatically:
- Calculates `total_orders`
- Calculates `total_spent`
- Updates `last_order_date`
- Updates `last_order_code`

## Data Relationships

```
customers (1) ──< (many) customer_addresses
customers (1) ──< (many) customer_orders_summary
customer_orders_summary (1) ──< (many) customer_order_items
customer_orders_summary (many) ──> (1) import_batches
customer_orders_summary ──> order_delivery_status (via order_code)
```

## Common Queries

### Get Customer with All Orders
```sql
SELECT 
  c.*,
  json_agg(
    json_build_object(
      'order_code', cos.order_code,
      'order_date', cos.order_date,
      'total', cos.total_with_tax,
      'stage', cos.delivery_stage
    )
  ) as orders
FROM customers c
LEFT JOIN customer_orders_summary cos ON c.id = cos.customer_id
WHERE c.email = 'customer@example.com'
GROUP BY c.id;
```

### Get Customer Lifetime Value
```sql
SELECT 
  email,
  first_name,
  last_name,
  total_orders,
  total_spent,
  ROUND(total_spent / NULLIF(total_orders, 0), 2) as avg_order_value
FROM customers
WHERE is_active = TRUE
ORDER BY total_spent DESC;
```

### Get Orders by Delivery Stage
```sql
SELECT 
  delivery_stage,
  COUNT(*) as order_count,
  SUM(total_with_tax) as total_value
FROM customer_orders_summary
GROUP BY delivery_stage
ORDER BY order_count DESC;
```

### Get Customer Order History with Items
```sql
SELECT 
  cos.order_code,
  cos.order_date,
  cos.delivery_stage,
  json_agg(
    json_build_object(
      'product', coi.product_name,
      'variant', coi.variant_name,
      'quantity', coi.quantity,
      'customization', json_build_object(
        'patch', coi.patch_type,
        'name', coi.print_name,
        'number', coi.print_number
      )
    )
  ) as items
FROM customer_orders_summary cos
JOIN customer_order_items coi ON cos.id = coi.order_summary_id
WHERE cos.customer_id = 'customer-uuid'
GROUP BY cos.id, cos.order_code, cos.order_date, cos.delivery_stage
ORDER BY cos.order_date DESC;
```

## Indexes for Performance

All tables have optimized indexes:
- `customers`: vendure_customer_id, email, phone_number
- `customer_orders_summary`: customer_id, order_code, order_date, delivery_stage
- `customer_order_items`: order_summary_id, product_id

## Privacy & Security

- **RLS Enabled**: All tables have Row Level Security
- **Service Role**: Full access for backend sync
- **Customer Access**: Limited to own data via authenticated sessions

## Next Steps

1. **Analytics Dashboard**: Use these tables for customer analytics
2. **Email Marketing**: Use customer data for segmented campaigns
3. **Customer Support**: Quick access to order history and details
4. **Reporting**: Generate business reports directly from Supabase

