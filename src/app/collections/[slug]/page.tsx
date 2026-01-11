'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import ProductList from '@/components/products/ProductList';
import { productOperations } from '@/lib/vendure-operations';
import { getCollectionContent, COLLECTION_SLUG_MAP } from '@/lib/seo-content';
import { DirectAnswer } from '@/components/seo/DirectAnswer';
import { FAQSection } from '@/components/seo/FAQSection';
import { ClientBreadcrumbStructuredData } from '@/components/seo/ClientBreadcrumbStructuredData';
import { SEO_CONFIG } from '@/lib/seo-config';

const collectionCategories = [
  { name: 'Master Version', slug: 'master', href: '/collections/master' },
  { name: 'Player Version', slug: 'player-version', href: '/collections/player-version' },
  { name: 'Retro', slug: 'retro', href: '/collections/retro' },
  { name: 'Clubs', slug: 'club-jerseys', href: '/collections/club-jerseys' },
  { name: 'Countries', slug: 'national-team-jerseys', href: '/collections/national-team-jerseys' },
  { name: 'Kids', slug: 'kids', href: '/collections/kids' },
  { name: 'Special Editions', slug: 'special-editions', href: '/collections/special-editions' },
];

export default function CollectionPage() {
  const { slug } = useParams();
  const collectionSlug = slug as string;
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  // Get SEO content
  const collectionContent = getCollectionContent(collectionSlug);
  const displaySlug = COLLECTION_SLUG_MAP[collectionSlug] || collectionSlug;

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Prevent static generation by not rendering until mounted
  if (!mounted) {
    return null;
  }

  const pathname = usePathname();
  const isActiveCategory = (categorySlug: string) => {
    return pathname?.includes(categorySlug);
  };

  return (
    <>
      <ClientBreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-[100px] md:pt-[140px] pb-[60px] md:pb-[80px]">
          <div className="container mx-auto px-4 md:px-6 lg:px-[60px] max-w-7xl">
            {/* Category Navigation Bar - At Top */}
            <nav className="mb-12 md:mb-16">
              <div className="flex items-center justify-center gap-4 md:gap-8 overflow-x-auto scrollbar-hide">
                <Link
                  href="/collections"
                  className={`uppercase whitespace-nowrap transition-colors duration-300 pb-2 border-b-2 text-xs md:text-sm font-medium ${
                    pathname === '/collections'
                      ? 'text-black border-black'
                      : 'text-[#666666] border-transparent hover:text-black hover:border-black/30'
                  }`}
                >
                  All Products
                </Link>
                {collectionCategories.map((category) => {
                  const isActive = isActiveCategory(category.slug);
                  return (
                    <Link
                      key={category.slug}
                      href={category.href}
                      className={`uppercase whitespace-nowrap transition-colors duration-300 pb-2 border-b-2 text-xs md:text-sm font-medium ${
                        isActive
                          ? 'text-black border-black'
                          : 'text-[#666666] border-transparent hover:text-black hover:border-black/30'
                      }`}
                    >
                      {category.name}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-12 md:mb-16 gap-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-black leading-tight">
                {collectionContent?.h1 || collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1)}
              </h1>
              {collectionContent?.introText && (
                <p className="text-base md:text-lg text-[#666666] lg:max-w-[500px] lg:text-right leading-relaxed">
                  {collectionContent.introText}
                </p>
              )}
            </div>

            {/* Filter & Sort Bar */}
            <div className="flex items-center gap-4 md:gap-8 mb-8 md:mb-12 pb-4 md:pb-6 border-b border-[#E5E5E5]">
              <button className="flex items-center gap-2 uppercase text-xs md:text-sm font-semibold text-black hover:text-[#666666] transition-colors">
                <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
                Filter by <span className="text-[#666666] ml-1 font-normal">All</span>
              </button>
              <button className="flex items-center gap-2 uppercase text-xs md:text-sm font-semibold text-black hover:text-[#666666] transition-colors">
                <ArrowUpDown className="w-4 h-4" strokeWidth={2} />
                Sort by <span className="text-[#666666] ml-1 font-normal">Recommended</span>
              </button>
            </div>

            {/* Products Grid */}
            {loading ? (
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
            ) : (
              <ProductList initialProducts={products} collection={collectionSlug} />
            )}

            {/* FAQ Section */}
            {collectionContent?.faqs && collectionContent.faqs.length > 0 && (
              <div className="mt-32">
                <FAQSection faqs={collectionContent.faqs} title="Frequently Asked Questions" />
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

