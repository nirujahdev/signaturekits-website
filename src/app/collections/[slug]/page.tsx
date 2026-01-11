'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import ProductList from '@/components/products/ProductList';
import { productOperations } from '@/lib/vendure-operations';
import { getCollectionContent, COLLECTION_SLUG_MAP } from '@/lib/seo-content';
import { DirectAnswer } from '@/components/seo/DirectAnswer';
import { FAQSection } from '@/components/seo/FAQSection';
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData';
import { SEO_CONFIG } from '@/lib/seo-config';

export default function CollectionPage() {
  const { slug } = useParams();
  const collectionSlug = slug as string;
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);

  // Get SEO content
  const collectionContent = getCollectionContent(collectionSlug);
  const displaySlug = COLLECTION_SLUG_MAP[collectionSlug] || collectionSlug;

  useEffect(() => {
    loadCollection();
  }, [collectionSlug]);

  const loadCollection = async () => {
    setLoading(true);
    try {
      // Map collection slug to facet value
      const facetMap: Record<string, string> = {
        'retro': 'retro',
        'retro-jerseys': 'retro',
        'clubs': 'club',
        'club-jerseys': 'club',
        'countries': 'country',
        'national-team-jerseys': 'country',
        'kids': 'kids',
        'player-version': 'player-version',
        'special-editions': 'special-editions',
        'custom-name-number': 'custom-name-number',
        'sri-lanka-jerseys': 'sri-lanka-jerseys',
      };

      const facetValue = facetMap[collectionSlug] || collectionSlug;

      const result = await productOperations.getProducts({
        take: 50,
        filter: {
          facetValueFilters: [
            {
              and: [
                {
                  code: { eq: facetValue },
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
  const collectionName = collectionContent?.h1 || collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1);
  
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: collectionName, url: `${baseUrl}/collections/${displaySlug}` },
  ].filter((item) => item.name && item.url); // Ensure all items are valid

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-6 py-12">
          {/* H1 and Direct Answer */}
          <div className="mb-12">
            <h1 className="text-5xl font-semibold mb-4">
              {collectionContent?.h1 || collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1)}
            </h1>
            
            {/* Direct Answer Block */}
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

            {/* Intro Text (150-300 words) */}
            {collectionContent?.introText && (
              <div className="prose max-w-3xl mb-8">
                <p className="text-lg text-gray-600 leading-relaxed">
                  {collectionContent.introText}
                </p>
              </div>
            )}
          </div>

          {/* Products Grid */}
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
            <ProductList initialProducts={products} collection={collectionSlug} />
          )}

          {/* FAQ Section */}
          {collectionContent?.faqs && collectionContent.faqs.length > 0 && (
            <FAQSection faqs={collectionContent.faqs} title="Frequently Asked Questions" />
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}

