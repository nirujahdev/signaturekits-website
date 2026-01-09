# Data Model Documentation

## Overview

This document describes the complete data structure for the Signature Kits e-commerce platform, including both Vendure (Postgres) and Supabase tables.

## Database Architecture

### Primary Database: Supabase Postgres
- **Vendure Tables**: Managed by Vendure (products, orders, customers, etc.)
- **Custom Tables**: Managed in Supabase for business logic

### Supabase Custom Tables

#### 1. Customers (`customers`)
Comprehensive customer data synced from Vendure.

**Key Fields:**
- `vendure_customer_id` (unique) - Links to Vendure customer
- `email` (unique) - Customer email
- `phone_number` - Sri Lanka format (947xxxxxxxx)
- `phone_verified` - SMS OTP verification status
- `total_orders` - Auto-calculated order count
- `total_spent` - Auto-calculated lifetime value
- `last_order_date` - Most recent order date
- `marketing_consent` - GDPR compliance
- `custom_fields` (JSONB) - Flexible metadata

**Relationships:**
- One-to-many with `customer_addresses`
- One-to-many with `customer_orders_summary`

#### 2. Customer Addresses (`customer_addresses`)
Multiple shipping/billing addresses per customer.

**Key Fields:**
- `customer_id` - Foreign key to `customers`
- `vendure_address_id` - Links to Vendure address
- `address_type` - 'shipping', 'billing', or 'both'
- `is_default` - Default address flag

#### 3. Customer Orders Summary (`customer_orders_summary`)
Denormalized order data for quick customer queries.

**Key Fields:**
- `customer_id` - Foreign key to `customers`
- `vendure_order_id` (unique) - Links to Vendure order
- `order_code` (unique) - Human-readable order code
- `delivery_stage` - 5-stage tracking status
- `payment_method` - PayHere, COD, etc.
- `total_with_tax` - Order total
- `batch_id` - Links to import batch
- `tracking_number` - Courier tracking

**Relationships:**
- Many-to-one with `customers`
- One-to-many with `customer_order_items`
- Many-to-one with `import_batches`

#### 4. Customer Order Items (`customer_order_items`)
Detailed line items for each order.

**Key Fields:**
- `order_summary_id` - Foreign key to `customer_orders_summary`
- `product_name`, `variant_name` - Product details
- `quantity`, `unit_price_with_tax` - Pricing
- `patch_enabled`, `patch_type` - Customization
- `print_name`, `print_number` - Personalization

#### 5. Import Batches (`import_batches`)
Pre-order batch management.

**Key Fields:**
- `batch_number` (unique) - Auto-generated batch ID
- `status` - collecting, orderedFromSupplier, inTransit, arrived, dispatched, completed
- `target_order_count` - Threshold for supplier order
- `order_count` - Current orders in batch

**Relationships:**
- One-to-many with `order_batch_assignments`
- One-to-many with `supplier_purchase_lists`

#### 6. Order Batch Assignments (`order_batch_assignments`)
Links orders to import batches.

**Key Fields:**
- `vendure_order_id` - Links to Vendure order
- `batch_id` - Foreign key to `import_batches`

#### 7. Supplier Purchase Lists (`supplier_purchase_lists`)
Exported purchase lists for suppliers.

**Key Fields:**
- `batch_id` - Foreign key to `import_batches`
- `product_sku`, `variant_sku` - Product identification
- `quantity` - Order quantity
- `patch_enabled`, `patch_type` - Customization details
- `print_name`, `print_number` - Personalization

#### 8. Order Delivery Status (`order_delivery_status`)
5-stage delivery tracking.

**Key Fields:**
- `order_code` (unique) - Links to order
- `stage` - ORDER_CONFIRMED, SOURCING, ARRIVED, DISPATCHED, DELIVERED
- `tracking_number` - Shown when DISPATCHED or DELIVERED
- `updated_at` - Last status change

**Relationships:**
- One-to-many with `order_delivery_status_events` (history)

#### 9. Order Delivery Status Events (`order_delivery_status_events`)
History of all delivery status changes.

**Key Fields:**
- `order_code` - Links to order
- `stage` - Status at time of event
- `updated_at` - Event timestamp

#### 10. OTP Sessions (`otp_sessions`)
SMS OTP verification sessions.

**Key Fields:**
- `phone` - Phone number (947xxxxxxxx format)
- `otp_hash` - Hashed OTP (bcrypt)
- `session_id` - Session identifier
- `verified` - Verification status
- `attempts` - Failed attempt count
- `expires_at` - OTP expiration

#### 11. Order Tracking (`order_tracking`)
Legacy tracking table (can be merged with delivery_status).

**Key Fields:**
- `vendure_order_id` (unique) - Links to Vendure order
- `tracking_number` - Courier tracking
- `carrier` - Trans Express
- `status` - pending, confirmed, processing, shipped, delivered

## Data Flow

### Customer Registration
1. Customer created in Vendure
2. `CustomerSyncPlugin` syncs to `customers` table
3. Addresses synced to `customer_addresses`

### Order Placement
1. Order created in Vendure
2. `CustomerSyncPlugin` syncs order to `customer_orders_summary`
3. Order items synced to `customer_order_items`
4. Customer statistics updated via `update_customer_statistics()`
5. Order assigned to batch (if applicable)
6. Delivery status initialized to `ORDER_CONFIRMED`

### Delivery Tracking
1. Admin updates `deliveryStage` in Vendure Order custom field
2. `DeliveryStatusPlugin` syncs to `order_delivery_status`
3. History entry created in `order_delivery_status_events`
4. Customer views status via `/orders/[code]` with phone validation

### Batch Management
1. Admin creates import batch
2. Orders assigned to batch via `order_batch_assignments`
3. When batch reaches threshold, export to `supplier_purchase_lists`
4. Batch status updated through lifecycle

## Indexes

### Performance Indexes
- `customers`: vendure_customer_id, email, phone_number, is_active
- `customer_orders_summary`: customer_id, order_code, order_date, delivery_stage
- `order_delivery_status`: order_code, stage
- `otp_sessions`: phone, session_id, expires_at

### Foreign Key Indexes
- All foreign keys automatically indexed

## Functions

### `update_customer_statistics(customer_id)`
Automatically updates customer order count, total spent, and last order date.

### `update_order_delivery_status(order_code, stage, tracking_number, note, updated_by)`
Upserts delivery status and creates history entry.

### `generate_batch_number()`
Generates unique batch numbers (YYYYMMDD-#### format).

### `get_batch_statistics(batch_uuid)`
Returns batch statistics including completion percentage.

### `export_supplier_purchase_list(batch_uuid)`
Exports aggregated purchase list for supplier.

## Sync Strategy

### Vendure → Supabase
- **Customers**: Real-time sync via `CustomerSyncPlugin` on create/update
- **Orders**: Real-time sync via `CustomerSyncPlugin` on create/update
- **Delivery Status**: Real-time sync via `DeliveryStatusPlugin` on order update

### Supabase → Vendure
- Delivery status can be updated in Supabase and synced back to Vendure (optional)

## Data Retention

- **Active Data**: All tables keep active records indefinitely
- **History**: `order_delivery_status_events` keeps full history
- **OTP Sessions**: Auto-cleanup via `cleanup_expired_otps()` function

## Privacy & Security

- **RLS Policies**: All tables have Row Level Security enabled
- **Service Role**: Full access for backend operations
- **Authenticated Users**: Limited read access to own data
- **Phone Validation**: Required for order tracking (privacy protection)

