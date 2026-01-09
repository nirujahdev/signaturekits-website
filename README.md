# Signature Kits - Jersey Pre-Order E-commerce

Production-ready jersey pre-order e-commerce platform for Sri Lanka.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) on Vercel
- **Commerce Backend**: Vendure (Server + Worker)
- **Database**: Supabase Postgres
- **Search**: Typesense (instant search + faceted filters)
- **Payments**: PayHere (full payment) + COD
- **OTP Verification**: Text.lk SMS Gateway
- **Email**: SMTP (Spacemail or similar)

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account and database
- PayHere merchant account
- Text.lk SMS Gateway account (API token provided)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/signaturekits/signaturekits-website.git
cd signaturekits-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

Edit `.env` and fill in your credentials:
- Supabase database connection details
- PayHere merchant credentials
- Text.lk SMS Gateway credentials (API token)
- SMTP email configuration
- Typesense configuration

4. Start the development servers:

**Terminal 1 - Next.js Frontend:**
```bash
npm run dev
```

**Terminal 2 - Vendure Server:**
```bash
npm run vendure:dev
```

**Terminal 3 - Vendure Worker:**
```bash
npm run vendure:worker
```

### Access Points

- **Frontend**: http://localhost:3000
- **Vendure Admin UI**: http://localhost:3000/admin
- **Shop API**: http://localhost:3000/shop-api
- **Admin API**: http://localhost:3000/admin-api
- **Email Test Mailbox** (dev): http://localhost:3003

## Project Structure

```
├── src/                    # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── contexts/          # React contexts (Cart)
│   └── lib/               # Utilities (Vendure, Typesense, Text.lk)
├── vendure/               # Vendure backend
│   └── src/
│       ├── plugins/       # Custom plugins
│       ├── lib/           # Utilities
│       └── vendure-config.ts
└── supabase/              # Supabase migrations (applied via MCP)
```

## Features

- ✅ Product catalog with customization (patch, name, number)
- ✅ Shopping cart and checkout
- ✅ SMS OTP verification (Text.lk)
- ✅ Payment: PayHere + COD
- ✅ Batch import system
- ✅ Order tracking
- ✅ Admin dashboard (Vendure)
- ✅ Search (Typesense)
