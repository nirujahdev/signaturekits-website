'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchProducts } from '@/lib/typesense-client';
import { Loader2, Search } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalFound, setTotalFound] = useState(0);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalFound(0);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await searchProducts(searchQuery);
      setResults(
        searchResults.hits.map((hit: any) => ({
          id: hit.document.slug || hit.document.productId,
          name: hit.document.name,
          category: hit.document.category || 'JERSEY',
          price: hit.document.price / 100, // Convert from cents
          image: hit.document.image || '/placeholder-jersey.jpg',
        }))
      );
      setTotalFound(searchResults.found || 0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setTotalFound(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 md:px-6 lg:px-[60px] max-w-7xl pt-[120px] pb-20">
        {/* Search Header */}
        <div className="mb-12">
          <h1 className="text-[40px] md:text-[56px] lg:text-[72px] font-medium leading-[1.1] tracking-[-0.02em] text-black mb-4">
            Search
          </h1>
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search jerseys, teams, players..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-4 h-14 text-lg border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0"
                autoFocus
              />
            </div>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-4 text-gray-500">Searching...</p>
          </div>
        )}

        {/* Results Count */}
        {!loading && query && totalFound > 0 && (
          <div className="mb-8">
            <p className="text-[16px] text-gray-600">
              Found {totalFound} result{totalFound !== 1 ? 's' : ''} for <span className="font-semibold text-black">"{query}"</span>
            </p>
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && query && (
          <div className="text-center py-20">
            <p className="text-[18px] text-gray-500 mb-2">No products found</p>
            <p className="text-[14px] text-gray-400">Try a different search term</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!query && !loading && (
          <div className="text-center py-20">
            <p className="text-[18px] text-gray-500">Enter a search term to find jerseys</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          </div>
        </main>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

