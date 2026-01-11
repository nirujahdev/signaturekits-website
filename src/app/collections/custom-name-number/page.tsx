'use client';

import { useEffect, useState } from 'react';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import ProductList from '@/components/products/ProductList';
import { productOperations } from '@/lib/vendure-operations';
import { getCollectionContent } from '@/lib/seo-content';
import { DirectAnswer } from '@/components/seo/DirectAnswer';
import { FAQSection } from '@/components/seo/FAQSection';
import dynamicImport from 'next/dynamic';
import { SEO_CONFIG } from '@/lib/seo-config';

// Dynamically import BreadcrumbStructuredData to avoid static generation issues
const BreadcrumbStructuredData = dynamicImport(
  () => import('@/components/seo/StructuredData').then((mod) => mod.BreadcrumbStructuredData),
  { ssr: false }
);

export default function CustomNameNumberPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const collectionContent = getCollectionContent('custom-name-number');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    loadCollection();
  }, []);

  const loadCollection = async () => {
    setLoading(true);
    try {
      const result = await productOperations.getProducts({
        take: 50,
        filter: {
          facetValueFilters: [
            {
              and: [
                {
                  code: { eq: 'custom-name-number' },
                },
              ],
            },
          ],
        },
      });

      if (result?.products?.items) {
        setProducts(result.products.items);
      }
    } catch (error) {
      console.error('Error loading collection:', error);
    } finally {
      setLoading(false);
    }
  };

  // Defensive checks for breadcrumb items
  const baseUrl = SEO_CONFIG?.BASE_URL || 'https://signaturekits-website.vercel.app';
  const collectionName = collectionContent?.h1 || 'Custom Name & Number';
  
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: collectionName, url: `${baseUrl}/collections/custom-name-number` },
  ].filter((item) => item.name && item.url); // Ensure all items are valid

  return (
    <>
      {mounted && <BreadcrumbStructuredData items={breadcrumbItems} />}
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="mb-12">
            <h1 className="text-5xl font-semibold mb-4">
              {collectionContent?.h1 || 'Custom Name & Number'}
            </h1>
            
            {collectionContent?.directAnswer && SEO_CONFIG && (
              <div className="mb-6">
                <DirectAnswer
                  deliveryDays={SEO_CONFIG.DELIVERY_WINDOW || '10–20 working days'}
                  hasCustomization={SEO_CONFIG.CUSTOM_NAME_NUMBER ?? true}
                  hasCOD={SEO_CONFIG.COD ?? true}
                  isPreOrder={true}
                />
              </div>
            )}

            {collectionContent?.introText && (
              <div className="prose max-w-3xl mb-8">
                <p className="text-lg text-gray-600 leading-relaxed">
                  {collectionContent.introText}
                </p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[4/5] rounded" />
                  <div className="h-4 bg-gray-200 rounded mt-4 w-3/4" />
                  <div className="h-4 bg-gray-200 rounded mt-2 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <ProductList initialProducts={products} collection="custom-name-number" />
          )}

          {collectionContent?.faqs && collectionContent.faqs.length > 0 && (
            <FAQSection faqs={collectionContent.faqs} title="Frequently Asked Questions" />
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}

