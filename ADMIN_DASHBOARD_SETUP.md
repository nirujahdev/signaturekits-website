# Admin Dashboard Setup Guide

## Overview

The custom Next.js admin dashboard has been built to replace Vendure, using Supabase as the backend. The dashboard includes authentication, customer management, order management, batch imports, and delivery tracking.

## Initial Setup

### 1. Create Admin User

Before you can log in, create an admin user:

```bash
curl -X POST http://localhost:3000/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@signaturekits.xyz", "password": "your-secure-password"}'
```

Or use the Supabase dashboard to insert directly into the `admin_users` table.

### 2. Environment Variables

Ensure these are set in your `.env`:

```
NEXT_PUBLIC_SUPABASE_URL=https://rmrdwwnuyuanribkcbew.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_SESSION_SECRET=your-random-secret
```

### 3. Access Admin Dashboard

1. Visit: `http://localhost:3000/admin/signin`
2. Log in with your admin credentials
3. You'll be redirected to `/admin` dashboard

## Features Implemented

### ✅ Completed

- **Authentication System**
  - Admin user table in Supabase
  - Login/logout API routes
  - Session management with cookies
  - Auth guard for protected routes
  - Sign-in page

- **Admin Layout**
  - Sidebar navigation
  - Header with search and user menu
  - Theme support (light/dark)
  - Responsive design

- **Dashboard**
  - Statistics cards (Customers, Orders, Revenue, Pending Orders)
  - Recent orders table
  - API route for dashboard stats

- **Navigation**
  - Dashboard
  - Customers
  - Orders
  - Batches
  - Delivery Tracking

### 🚧 In Progress / To Complete

- **Customers Page** (`/admin/customers`)
  - List view with search and filters
  - Customer detail page
  - Edit customer information
  - View customer orders

- **Orders Page** (`/admin/orders`)
  - Order list with filters
  - Order detail page
  - Update order status
  - Assign to batch

- **Batches Page** (`/admin/batches`)
  - Batch list
  - Create new batch
  - Assign orders to batch
  - Export supplier purchase list

- **Delivery Tracking Page** (`/admin/delivery`)
  - List orders with delivery stages
  - Update delivery stage
  - Add/update tracking numbers

## API Routes

### Authentication
- `POST /api/admin/auth/login` - Login
- `POST /api/admin/auth/logout` - Logout
- `GET /api/admin/auth/session` - Check session

### Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

### Admin Management
- `POST /api/admin/create-admin` - Create admin user (one-time setup)

## Database Tables

The admin dashboard uses these Supabase tables:

- `admin_users` - Admin authentication
- `customers` - Customer data
- `customer_orders_summary` - Order summaries
- `customer_order_items` - Order line items
- `import_batches` - Batch import management
- `order_delivery_status` - Delivery tracking
- `order_delivery_status_events` - Delivery history
- `otp_sessions` - SMS OTP sessions

## Next Steps

1. Complete the Customers, Orders, Batches, and Delivery pages
2. Add API routes for CRUD operations
3. Implement search and filtering
4. Add export functionality for supplier lists
5. Update frontend store to work without Vendure (if needed)

## Notes

- All admin routes are protected by `AdminAuthGuard`
- Session tokens are stored in HTTP-only cookies
- Service role key is required for admin operations
- The dashboard uses the admin UI components from the `admin` folder

