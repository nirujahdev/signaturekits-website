# Vendure Configuration

This directory contains the Vendure e-commerce backend configuration for Signature Kits.

## Structure

- `src/vendure-config.ts` - Main Vendure configuration
- `src/server.ts` - Server entry point (GraphQL API + Admin UI)
- `src/index.ts` - Worker entry point (background jobs)
- `migrations/` - Database migrations
- `static/` - Static assets and email templates

## Setup

1. Copy `env.example` to `.env` in the project root and fill in your values:
   - Supabase Postgres connection details
   - Session secret (generate a random string)
   - SMTP email configuration
   - PayHere credentials
   - WhatsApp Cloud API credentials
   - Typesense configuration

2. Run database migrations (on first setup):
   ```bash
   npm run vendure:dev
   ```
   This will auto-sync the schema in development mode.

3. Start the Vendure server:
   ```bash
   npm run vendure:dev
   ```

4. Start the Vendure worker (in a separate terminal):
   ```bash
   npm run vendure:worker
   ```

## Access Points

- **Admin UI**: http://localhost:3000/admin
- **Shop API**: http://localhost:3000/shop-api
- **Admin API**: http://localhost:3000/admin-api
- **Email Test Mailbox** (dev mode): http://localhost:3003

## Custom Fields

The configuration includes custom fields for:

### OrderLine
- `patchEnabled` (boolean) - Whether a patch is added
- `patchType` (string) - Type of patch
- `printName` (string) - Name to print on jersey
- `printNumber` (string) - Number to print on jersey

### Order & Customer
- `whatsappNumber` (string) - WhatsApp number in E.164 format
- `whatsappOptIn` (boolean) - Opt-in status
- `whatsappVerified` (boolean) - OTP verification status

## Next Steps

- [ ] Add PayHere payment handler
- [ ] Add COD payment handler
- [ ] Add Trans Express shipping calculator
- [ ] Implement WhatsApp OTP verification
- [ ] Set up Typesense indexing
- [ ] Create batch import system

