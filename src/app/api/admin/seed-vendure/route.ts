import { NextRequest, NextResponse } from 'next/server';

const VENDURE_ADMIN_API = process.env.NEXT_PUBLIC_VENDURE_API_URL?.replace('/shop-api', '/admin-api') || 'http://localhost:3000/admin-api';

/**
 * Seed Vendure with sample data via Admin API
 * POST /api/admin/seed-vendure
 * 
 * Requires admin authentication token
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SEED_TOKEN || 'dev-seed-token'}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { adminToken } = await req.json();
    if (!adminToken) {
      return NextResponse.json({ error: 'Admin token required' }, { status: 400 });
    }

    const results = {
      products: [],
      customers: [],
      orders: [],
      errors: [],
    };

    // Sample Products
    const products = [
      {
        translations: [{
          languageCode: 'en',
          name: 'AC Milan 06/07 Home Jersey',
          slug: 'ac-milan-06-07-home',
          description: 'Classic AC Milan home jersey from the 2006/07 season. Authentic design with premium materials.',
        }],
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
        translations: [{
          languageCode: 'en',
          name: 'Manchester United 08/09 Home Jersey',
          slug: 'manchester-united-08-09-home',
          description: 'Iconic Manchester United home jersey from the 2008/09 season.',
        }],
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
        translations: [{
          languageCode: 'en',
          name: 'Sri Lanka National Team 2024 Home',
          slug: 'sri-lanka-2024-home',
          description: 'Official Sri Lanka national team home jersey 2024.',
        }],
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
        translations: [{
          languageCode: 'en',
          name: 'Barcelona 10/11 Home Jersey',
          slug: 'barcelona-10-11-home',
          description: 'Retro Barcelona home jersey from the 2010/11 season.',
        }],
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
        translations: [{
          languageCode: 'en',
          name: 'Real Madrid 11/12 Away Jersey',
          slug: 'real-madrid-11-12-away',
          description: 'Classic Real Madrid away jersey from the 2011/12 season.',
        }],
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

    // Create Products
    const CREATE_PRODUCT = `
      mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
          id
          name
          slug
        }
      }
    `;

    for (const product of products) {
      try {
        const response = await fetch(`${VENDURE_ADMIN_API}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            query: CREATE_PRODUCT,
            variables: { input: product },
          }),
        });

        const data = await response.json();
        if (data.errors) {
          results.errors.push({ product: product.translations[0].name, error: data.errors[0].message });
        } else {
          results.products.push(data.data.createProduct);
        }
      } catch (error: any) {
        results.errors.push({ product: product.translations[0].name, error: error.message });
      }
    }

    // Sample Customers
    const customers = [
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

    const CREATE_CUSTOMER = `
      mutation CreateCustomer($input: CreateCustomerInput!) {
        createCustomer(input: $input) {
          id
          emailAddress
        }
      }
    `;

    for (const customer of customers) {
      try {
        const response = await fetch(`${VENDURE_ADMIN_API}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            query: CREATE_CUSTOMER,
            variables: { input: customer },
          }),
        });

        const data = await response.json();
        if (data.errors) {
          results.errors.push({ customer: customer.emailAddress, error: data.errors[0].message });
        } else {
          results.customers.push(data.data.createCustomer);
        }
      } catch (error: any) {
        results.errors.push({ customer: customer.emailAddress, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Vendure seeding completed',
      results,
    });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: error.message || 'Seeding failed' },
      { status: 500 }
    );
  }
}

