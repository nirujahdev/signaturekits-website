# Supabase Data Admin UI Extensions

This directory contains React components for displaying Supabase data in the Vendure Admin UI.

## Structure

- `nav-items.ts` - Navigation menu items configuration
- `components/` - Shared React components (CustomerCard, OrderCard, DeliveryStageBadge, DataTable)
- `routes/` - Page components for each section:
  - `customers.tsx` - Customer list page
  - `customer-detail.tsx` - Customer detail page
  - `orders.tsx` - Order list page
  - `order-detail.tsx` - Order detail page
  - `delivery-tracking.tsx` - Delivery tracking page
  - `batches.tsx` - Batch management page
  - `otp-sessions.tsx` - OTP sessions page

## Integration with Vendure Admin UI

The Admin UI components use GraphQL queries from the `SupabaseDataPlugin` to fetch data.

### GraphQL Queries Used

- `supabaseCustomers` - List customers
- `supabaseCustomer` - Get customer details
- `supabaseOrders` - List orders
- `supabaseOrderSummary` - Get order details
- `supabaseAllDeliveryStatuses` - List delivery statuses
- `supabaseBatches` - List import batches
- `supabaseOTPSessions` - List OTP sessions

### GraphQL Mutations Used

- `updateDeliveryStatus` - Update order delivery stage
- `updateCustomerData` - Update customer information

## Note on Admin UI Extension

Vendure Admin UI extensions may require:
1. Building the UI extensions separately
2. Using `@vendure/ui-devkit` for development
3. Configuring routes in the AdminPlugin

The components are ready to use but may need additional configuration depending on your Vendure version and setup.

