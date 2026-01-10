# SEO & AEO Implementation Guide

## ✅ Completed

### 1. Database Schema
- ✅ Created `seo_pages` table in Supabase for static page SEO
- ✅ Added SEO columns to products/collections tables (if they exist)

### 2. Core SEO Utilities
- ✅ `src/lib/seo.ts` - SEO helper functions (title/description generators, FAQ defaults)
- ✅ `src/lib/generate-metadata.ts` - Next.js Metadata API utilities
- ✅ Structured data components (`src/components/seo/StructuredData.tsx`)
- ✅ AEO components (`DirectAnswer.tsx`, `FAQSection.tsx`)

### 3. Sitemap & Robots
- ✅ `src/app/sitemap.ts` - XML sitemap generator
- ✅ `src/app/robots.ts` - Robots.txt configuration

### 4. Homepage
- ✅ Added metadata with proper title/description
- ✅ Organization structured data
- ✅ FAQ section with structured data

## 🔄 In Progress / Needs Fixing

### Client Component Metadata Issue
Next.js doesn't allow `export const metadata` in client components. For client components, we need to:

1. **Option A**: Create a layout wrapper (recommended)
2. **Option B**: Use `generateMetadata` in parent layout
3. **Option C**: Convert to server component where possible

### Pages That Need Metadata Fixes:
- `src/app/search/page.tsx` - Remove metadata export, add to layout
- `src/app/cart/page.tsx` - Remove metadata export, add to layout  
- `src/app/checkout/page.tsx` - Add noindex metadata
- `src/app/collections/[slug]/page.tsx` - Add metadata + SEO content
- `src/app/product/[id]/page.tsx` - Add metadata + structured data + AEO content

## 📋 Remaining Tasks

### 1. Fix Client Component Metadata
Create layout files for client pages:

```typescript
// src/app/search/layout.tsx
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/generate-metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Search | Signature Kits',
  description: 'Search for football jerseys in Sri Lanka',
  path: '/search',
  noIndex: true,
});

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

### 2. Product Page SEO
- Add `generateMetadata` function (server component wrapper)
- Add Product structured data
- Add BreadcrumbList structured data
- Add DirectAnswer block
- Add FAQ section with structured data
- Improve image alt text

### 3. Collection Page SEO
- Add metadata generation
- Add intro text (150-300 words)
- Add FAQ section
- Add BreadcrumbList structured data

### 4. Image SEO
- Update ProductCard to use descriptive alt text
- Update product detail images with proper alt attributes
- Ensure filenames are descriptive (or store alt overrides)

### 5. Environment Variables
Add to `.env`:
```
NEXT_PUBLIC_SITE_URL=https://signaturekits-website.vercel.app
```

## 🎯 Best Practices Implemented

### Title Tags
- Format: `{Product/Collection} in Sri Lanka | Signature Kits`
- Includes pre-order indicator when applicable
- Unique per page

### Meta Descriptions
- 150-160 characters
- Includes: quality, delivery window, payment/COD, customization, CTA
- No keyword stuffing

### Structured Data
- Product + Offer schema (with shipping details)
- BreadcrumbList
- Organization (homepage)
- FAQPage (where applicable)

### AEO (Answer Engine Optimization)
- Direct Answer blocks at top of product pages
- FAQ sections with question headings (H2/H3)
- Short answers (1-2 sentences) followed by details
- FAQ structured data

### Robots/Indexing
- Noindex: `/cart`, `/checkout`, `/search`, `/admin`, filtered URLs
- Index: Home, categories, products, policies
- Canonical URLs remove query params

## 📝 Usage Examples

### Adding Metadata to a Page
```typescript
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/generate-metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Your Page Title',
  description: 'Your meta description',
  path: '/your-path',
  ogImage: '/path-to-og-image.jpg',
  noIndex: false, // true for cart/checkout/search
});
```

### Adding Structured Data
```typescript
import { ProductStructuredData, BreadcrumbStructuredData } from '@/components/seo/StructuredData';

// In your component
<ProductStructuredData
  product={{ name: '...', description: '...' }}
  url="https://..."
  images={[...]}
  price={5000}
  currency="LKR"
  availability="PreOrder"
/>
```

### Adding AEO Content
```typescript
import { DirectAnswer } from '@/components/seo/DirectAnswer';
import { FAQSection } from '@/components/seo/FAQSection';
import { DEFAULT_PRODUCT_FAQS } from '@/lib/seo';

// In your component
<DirectAnswer
  deliveryDays="10–20"
  hasCustomization={true}
  hasCOD={true}
/>

<FAQSection faqs={DEFAULT_PRODUCT_FAQS} />
```

## 🚀 Next Steps

1. Fix client component metadata issues (create layouts)
2. Complete product page SEO implementation
3. Complete collection page SEO implementation
4. Add image alt text improvements
5. Test with Google Rich Results Test
6. Submit sitemap to Google Search Console

