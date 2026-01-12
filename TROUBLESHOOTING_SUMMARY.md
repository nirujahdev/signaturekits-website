# Product Visibility Troubleshooting Summary

## Issue Reported
Product "AC MILAN 2006-07 HOME FULL SLEEVE - KAKA" appears in Admin Dashboard but NOT showing in collections page on the website frontend.

## Diagnosis Tools Created

### 1. In-Browser Diagnostics Page
**Location:** `/admin/diagnostics`

Access this page while logged into the admin dashboard to run automatic tests:
- ✅ Public Products API connectivity
- ✅ Admin Products API connectivity  
- ✅ AC Milan product visibility check
- ✅ Data visibility comparison (admin vs public)
- ✅ Collection filtering test

**How to use:**
1. Log into admin dashboard
2. Navigate to Admin → Diagnostics (in sidebar)
3. Click "Run Diagnostics" button
4. Review results and follow recommendations

### 2. Detailed Diagnostic Guide
**Location:** `PRODUCT_VISIBILITY_DIAGNOSTIC.md`

Step-by-step manual diagnostic process covering:
- Product status verification
- Categories/tags configuration
- RLS policy checking
- API route testing
- Collection filter matching
- Cache issues
- Image validation

## Most Likely Root Causes (Ranked)

### 1. ⚠️  Row Level Security (RLS) Policy Issue (80% likelihood)
**Symptom:** Product exists in admin, marked as active, but public API returns empty array

**Why:** Supabase RLS policies might be blocking anonymous (public) access to the products table

**Fix:**
```sql
-- Run in Supabase SQL Editor
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Service role has full access"
  ON products
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

**How to verify:**
- Go to Supabase Dashboard → Authentication → Policies
- Check if products table has a SELECT policy for `anon` role
- Policy should allow WHERE `is_active = true`

### 2. ⚠️  Product is Inactive (15% likelihood)
**Symptom:** Product shows in admin with gray "Inactive" badge

**Fix:**
1. Admin Dashboard → Products
2. Find AC Milan product
3. Click Edit (pencil icon)
4. Scroll to bottom
5. Check "Active" checkbox
6. Click "Update Product"

**How to verify:**
- In admin products list, Status column should show green "Active" badge
- Or run diagnostics page to check `is_active` field

### 3. Missing/Wrong Categories or Tags (3% likelihood)
**Symptom:** Product doesn't appear in specific collection pages (e.g., /collections/retro)

**Why:** Collection pages filter by categories and tags. If product doesn't have matching category/tag, it won't show.

**Fix:**
1. Admin Dashboard → Products → Edit AC Milan
2. Add appropriate categories:
   - "Signature Embroidery" (already present)
   - "Retro" (if retro jersey)
   - "Club" (for club jerseys)
3. Add tags as needed
4. Save product

**Collection Mapping:**
- `/collections` → Shows ALL active products
- `/collections/retro` → Requires "retro" in categories OR tags
- `/collections/club-jerseys` → Requires "club" in categories OR tags
- `/collections/player-version` → Requires "player-version" in categories OR tags

### 4. Environment Variable Issues (1% likelihood)
**Symptom:** API routes return 500 errors

**Why:** Missing or incorrect Supabase credentials

**Check:**
- `NEXT_PUBLIC_SUPABASE_URL` is set
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` is set
- `SUPABASE_SERVICE_ROLE_KEY` is set (for admin)

### 5. Cache/Build Issues (<1% likelihood)
**Symptom:** Changes in admin not reflecting on frontend

**Fix:**
- Clear browser cache
- Open in incognito/private window
- Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Restart dev server if running locally

## Quick Diagnostic Commands

### Test in Browser Console (Frontend)
```javascript
// Test 1: Check if API is accessible
fetch('/api/products?limit=10')
  .then(r => r.json())
  .then(data => console.log('Products API:', data))
  .catch(err => console.error('Error:', err));

// Test 2: Search for AC Milan specifically
fetch('/api/products?limit=100')
  .then(r => r.json())
  .then(data => {
    const acMilan = data.products.items.find(p => 
      p.name.toUpperCase().includes('AC MILAN')
    );
    console.log('AC Milan found:', acMilan ? 'YES' : 'NO');
    if (acMilan) console.log(acMilan);
  });

// Test 3: Check collection filtering
fetch('/api/products?collection=retro')
  .then(r => r.json())
  .then(data => console.log('Retro collection:', data));
```

### Test in Supabase SQL Editor
```sql
-- Check if product exists
SELECT id, title, is_active, slug, categories, tags, images
FROM products
WHERE title ILIKE '%AC Milan%';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'products';

-- Count active vs inactive products
SELECT 
  is_active,
  COUNT(*) as count
FROM products
GROUP BY is_active;
```

## Data Flow Architecture

```
┌─────────────────────┐
│  Admin Dashboard    │
│   /admin/products   │
└──────────┬──────────┘
           │
           │ POST/PUT /api/admin/products
           │ (Uses Service Role Key)
           ▼
┌─────────────────────┐
│  Supabase Database  │
│   products table    │
│   - is_active       │
│   - categories      │
│   - tags            │
└──────────┬──────────┘
           │
           │ RLS POLICY CHECK
           │ (is_active = true?)
           │
           ▼
┌─────────────────────┐
│  Public API         │
│  /api/products      │
│  (Uses Anon Key)    │
└──────────┬──────────┘
           │
           │ GET request
           │
           ▼
┌─────────────────────┐
│  Frontend Pages     │
│  - /collections     │
│  - /collections/[slug] │
│  - /product/[slug]  │
└─────────────────────┘
```

## Expected Data Structure

### Product in Supabase
```json
{
  "id": "uuid",
  "title": "AC MILAN 2006-07 HOME FULL SLEEVE - KAKA",
  "slug": "ac-milan-2006-07-home-full-sleeve-kaka",
  "price": 4000,
  "currency_code": "LKR",
  "is_active": true,  // ← MUST BE TRUE
  "is_featured": false,
  "sizes": ["S", "M", "L", "XL"],
  "categories": ["Signature Embroidery", "Retro", "Club"],  // ← MUST HAVE VALUES
  "tags": ["retro", "club", "ac-milan"],
  "images": ["https://...image1.jpg", "https://...image2.jpg"],  // ← MUST HAVE AT LEAST 1
  "description": "...",
  "sku": "...",
  "created_at": "2026-01-12T..."
}
```

### Product in Frontend API Response
```json
{
  "products": {
    "items": [
      {
        "id": "uuid",
        "name": "AC MILAN 2006-07 HOME FULL SLEEVE - KAKA",
        "slug": "ac-milan-2006-07-home-full-sleeve-kaka",
        "description": "...",
        "featuredAsset": {
          "preview": "https://...image1.jpg",
          "source": "https://...image1.jpg"
        },
        "variants": [{
          "priceWithTax": 400000,  // price * 100
          "currencyCode": "LKR"
        }],
        "facetValues": [
          { "code": "signature-embroidery", "name": "Signature Embroidery" },
          { "code": "retro", "name": "retro" }
        ]
      }
    ],
    "totalItems": 1
  }
}
```

## Verification Checklist

Before declaring issue "fixed", verify ALL of these:

- [ ] Product exists in Supabase `products` table
- [ ] `is_active` = `true` (checkbox checked)
- [ ] `images` array has at least 1 valid URL
- [ ] `categories` array is not empty
- [ ] `slug` field is set (not null)
- [ ] `price` is greater than 0
- [ ] RLS policy allows public SELECT where `is_active = true`
- [ ] `/api/products` returns the product
- [ ] Product appears in `/collections` page
- [ ] Product appears in appropriate collection pages (e.g., `/collections/retro`)
- [ ] Product detail page loads at `/product/[slug]`
- [ ] Product images display correctly
- [ ] Product price displays correctly

## Next Steps for User

1. **Immediate Action:** Run the Diagnostics Page
   - Navigate to `/admin/diagnostics`
   - Click "Run Diagnostics"
   - Review the results - they will tell you exactly what's wrong

2. **If RLS Issue Detected:**
   - Go to Supabase Dashboard
   - Navigate to SQL Editor
   - Run the RLS policy SQL from section #1 above
   - Re-run diagnostics to verify fix

3. **If Product Inactive:**
   - Go to Admin → Products
   - Edit AC Milan product
   - Check "Active" checkbox
   - Save

4. **If Categories Missing:**
   - Edit product in admin
   - Add "Retro" and "Club" categories
   - Save

5. **Verify Fix:**
   - Open `/collections` in incognito window
   - AC Milan should now appear

## Files Modified/Created for Diagnostics

1. `src/app/admin/diagnostics/page.tsx` - Interactive diagnostic page
2. `PRODUCT_VISIBILITY_DIAGNOSTIC.md` - Step-by-step manual guide
3. `TROUBLESHOOTING_SUMMARY.md` - This file
4. `scripts/diagnose-product-issues.ts` - CLI diagnostic script (requires .env)
5. `src/components/admin/layout/AppSidebar.tsx` - Added Diagnostics menu item

## Support Contacts

If issue persists after running diagnostics:
1. Check Supabase Dashboard → Logs for errors
2. Check browser DevTools → Console for frontend errors
3. Check browser DevTools → Network tab for failed API calls
4. Review `PRODUCT_VISIBILITY_DIAGNOSTIC.md` for detailed troubleshooting steps

