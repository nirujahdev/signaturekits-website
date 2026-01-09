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
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold mb-8">Search Products</h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search jerseys, teams, players..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </form>

        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          </div>
        )}

        {!loading && query && (
          <div className="mb-4">
            <p className="text-gray-600">
              Found {totalFound} result{totalFound !== 1 ? 's' : ''} for "{query}"
            </p>
          </div>
        )}

        {!loading && results.length === 0 && query && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found. Try a different search term.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {!query && (
          <div className="text-center py-12">
            <p className="text-gray-500">Enter a search term to find jerseys</p>
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

