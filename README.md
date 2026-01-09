# Signature Kits - Jersey Pre-Order E-commerce

A production-ready jersey pre-order e-commerce platform for Sri Lanka, built with Next.js, Vendure, Supabase, PayHere, and WhatsApp OTP verification.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) on Vercel
- **Commerce Backend**: Vendure (Server + Worker)
- **Database**: Supabase Postgres
- **Search**: Typesense (instant search + faceted filters)
- **Payments**: PayHere (full payment) + COD
- **OTP Verification**: WhatsApp Cloud API
- **Email**: SMTP (Spacemail or similar)

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account and database
- PayHere merchant account
- WhatsApp Cloud API access

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
- WhatsApp Cloud API credentials
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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
