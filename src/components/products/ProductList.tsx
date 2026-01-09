'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { productOperations } from '@/lib/vendure-operations';

interface Product {
  id: string;
  name: string;
  slug: string;
  featuredAsset?: {
    preview: string;
  };
  variants: Array<{
    id: string;
    priceWithTax: number;
    currencyCode: string;
  }>;
}

interface ProductListProps {
  initialProducts?: Product[];
  limit?: number;
  collection?: string;
}

export default function ProductList({ initialProducts, limit = 20, collection }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);

  useEffect(() => {
    if (!initialProducts) {
      loadProducts();
    }
  }, [collection]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const filter: any = {};
      if (collection) {
        // Filter by collection/facet
        filter.facetValueFilters = [{ and: [{ code: { eq: collection } }] }];
      }

      const result = await productOperations.getProducts({
        take: limit,
        filter,
      });

      if (result?.products?.items) {
        setProducts(result.products.items);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-[4/5] rounded" />
            <div className="h-4 bg-gray-200 rounded mt-4 w-3/4" />
            <div className="h-4 bg-gray-200 rounded mt-2 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => {
        const variant = product.variants?.[0];
        const price = variant?.priceWithTax || 0;
        const currency = variant?.currencyCode || 'LKR';
        
        return (
          <ProductCard
            key={product.id}
            id={product.slug || product.id}
            name={product.name}
            category="JERSEY"
            price={price / 100} // Convert from cents
            image={product.featuredAsset?.preview || '/placeholder-jersey.jpg'}
          />
        );
      })}
    </div>
  );
}

