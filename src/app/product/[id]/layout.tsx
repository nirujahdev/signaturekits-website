import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/generate-metadata';
import { generateProductTitle, generateProductDescription } from '@/lib/seo';
import { SEO_CONFIG } from '@/lib/seo-config';
import { productOperations } from '@/lib/vendure-operations';
import { ProductStructuredData, BreadcrumbStructuredData } from '@/components/seo/StructuredData';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // Try to fetch product data
    const result = await productOperations.getProductBySlug(params.id);
    const product = result?.product;

    if (!product) {
      // Fallback if product not found
      return generatePageMetadata({
        title: `Product | Signature Kits`,
        description: 'Premium football jerseys in Sri Lanka',
        path: `/product/${params.id}`,
      });
    }

    const title = generateProductTitle(product.name, true, SEO_CONFIG.BRAND_NAME);
    const description = generateProductDescription(
      product.name,
      SEO_CONFIG.DELIVERY_WINDOW,
      SEO_CONFIG.CUSTOM_NAME_NUMBER,
      SEO_CONFIG.COD
    );

    return generatePageMetadata({
      title,
      description,
      path: `/product/${product.slug || params.id}`,
      ogImage: product.assets?.[0]?.preview,
    });
  } catch (error) {
    console.error('Error generating product metadata:', error);
    return generatePageMetadata({
      title: `Product | Signature Kits`,
      description: 'Premium football jerseys in Sri Lanka',
      path: `/product/${params.id}`,
    });
  }
}

export default async function ProductLayout({ 
  children,
  params 
}: { 
  children: React.ReactNode;
  params: { id: string };
}) {
  // Fetch product for structured data
  let product = null;
  let breadcrumbItems = [
    { name: 'Home', url: SEO_CONFIG.BASE_URL },
    { name: 'Product', url: `${SEO_CONFIG.BASE_URL}/product/${params.id}` },
  ];

  try {
    const result = await productOperations.getProductBySlug(params.id);
    product = result?.product;

    if (product) {
      // Update breadcrumb with actual product name
      breadcrumbItems = [
        { name: 'Home', url: SEO_CONFIG.BASE_URL },
        { name: product.name, url: `${SEO_CONFIG.BASE_URL}/product/${product.slug || params.id}` },
      ];
    }
  } catch (error) {
    console.error('Error fetching product for structured data:', error);
  }

  return (
    <>
      {product && (
        <>
          <BreadcrumbStructuredData items={breadcrumbItems} />
          <ProductStructuredData
            product={{
              name: product.name,
              description: product.description || `${product.name} - Premium replica jersey with Dri-Fit comfort.`,
            }}
            url={`${SEO_CONFIG.BASE_URL}/product/${product.slug || params.id}`}
            images={product.assets?.map(a => a.preview) || []}
            price={product.variants?.[0]?.priceWithTax}
            currency="LKR"
            availability="PreOrder"
            brand={SEO_CONFIG.BRAND_NAME}
            sku={product.variants?.[0]?.sku}
          />
        </>
      )}
      {children}
    </>
  );
}

