'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import ProductList from '@/components/products/ProductList';
import { productOperations } from '@/lib/vendure-operations';

const COLLECTION_INFO: Record<string, { title: string; description: string }> = {
  retro: {
    title: 'Retro Jerseys',
    description: 'Classic jerseys from iconic seasons. Relive the glory days with authentic retro designs.',
  },
  clubs: {
    title: 'Club Jerseys',
    description: 'Support your favorite clubs with official jerseys from leagues around the world.',
  },
  countries: {
    title: 'National Team Jerseys',
    description: 'Represent your country with pride. Official national team jerseys for men and women.',
  },
  kids: {
    title: 'Kids Jerseys',
    description: 'Perfect fit for young fans. All your favorite teams and players in kids sizes.',
  },
};

export default function CollectionPage() {
  const { slug } = useParams();
  const collectionSlug = slug as string;
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    loadCollection();
  }, [collectionSlug]);

  const loadCollection = async () => {
    setLoading(true);
    try {
      // Map collection slug to facet value
      const facetMap: Record<string, string> = {
        retro: 'retro',
        clubs: 'club',
        countries: 'country',
        kids: 'kids',
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

  const collectionInfo = COLLECTION_INFO[collectionSlug] || {
    title: collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1),
    description: 'Browse our collection of premium jerseys.',
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-semibold mb-4">{collectionInfo.title}</h1>
          <p className="text-lg text-gray-600 max-w-2xl">{collectionInfo.description}</p>
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
          <ProductList initialProducts={products} collection={collectionSlug} />
        )}
      </main>
      <Footer />
    </div>
  );
}

