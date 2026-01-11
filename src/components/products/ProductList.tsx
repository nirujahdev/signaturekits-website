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
      <div className="luxury-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse space-y-5">
            <div className="bg-[#F5F5F5] aspect-[4/5] rounded-sm" />
            <div className="space-y-2">
              <div className="h-4 bg-[#F5F5F5] rounded w-3/4" />
              <div className="h-3 bg-[#F5F5F5] rounded w-1/2" />
              <div className="h-4 bg-[#F5F5F5] rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-base md:text-lg text-[#999999]">No products found</p>
      </div>
    );
  }

  return (
    <div className="luxury-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

