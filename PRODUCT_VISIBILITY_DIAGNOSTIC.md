# Product Visibility Diagnostic Guide

## Issue
Product appears in Admin Dashboard but NOT in collections page on frontend.

## Common Root Causes

### 1. **Product Status (is_active)**
The most common issue - product is marked as inactive.

**Check:**
- Go to Admin Dashboard → Products
- Find the product (AC MILAN 2006-07 HOME FULL SLEEVE - KAKA)
- Verify "Status" column shows "Active" (green badge)

**Fix:**
- Click Edit icon
- Check "Active" checkbox at bottom of form
- Click "Update Product"

### 2. **Missing Categories/Tags**
Collections filter products by categories and tags. If product has wrong or missing categories, it won't appear in collections.

**Check:**
- In Admin Dashboard → Edit Product
- Verify "Categories" section has appropriate values selected
- Check "Tags" section

**Expected for AC Milan:**
- Categories: Should include "Signature Embroidery" (as shown in screenshot)
- Tags: Could include "retro", "club", etc.

**Fix:**
- Add relevant categories/tags:
  - `Signature Embroidery` (already present)
  - `Retro` (if it's a retro jersey)
  - `Club` (for club jerseys)
- Save the product

### 3. **Row Level Security (RLS) Policies**
Supabase RLS policies might be blocking public access to products.

**Check in Supabase Dashboard:**
```sql
-- Run this query in Supabase SQL Editor
SELECT * FROM products WHERE title ILIKE '%AC Milan%';
```

If you get results, but frontend doesn't show them, RLS is likely the issue.

**Fix:**
Run this SQL in Supabase SQL Editor:
```sql
-- Enable RLS on products table (if not already enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to active products
CREATE POLICY "Public can view active products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Allow admin (service role) to do everything
CREATE POLICY "Service role has full access"
  ON products
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

### 4. **API Route Not Fetching Products**
The `/api/products` route might have issues.

**Test:**
Open browser console and run:
```javascript
fetch('/api/products?limit=10')
  .then(r => r.json())
  .then(data => console.log('Products:', data))
  .catch(err => console.error('Error:', err));
```

**Expected Response:**
```json
{
  "products": {
    "items": [
      {
        "id": "...",
        "name": "AC MILAN 2006-07 HOME...",
        "slug": "...",
        "featuredAsset": {...},
        "variants": [...]
      }
    ],
    "totalItems": 1
  }
}
```

**If you get empty array or error:**
- Check browser DevTools Network tab for error messages
- Check if is_active filter is too restrictive

### 5. **Collection Filter Mismatch**
Collection pages filter by specific categories/tags. If the product's categories don't match the collection slug, it won't show.

**Collection Mapping (from code):**
```typescript
{
  'retro': 'retro',
  'club': 'club',
  'club-jerseys': 'club',
  'country': 'country',
  'national-team-jerseys': 'country',
  'kids': 'kids',
  'player-version': 'player-version',
  'special-editions': 'special-editions',
  'custom-name-number': 'custom-name-number',
  'sri-lanka-jerseys': 'sri-lanka-jerseys',
  'master': 'master',
}
```

**Check:**
- If viewing `/collections/retro`, product needs `retro` in categories OR tags
- If viewing `/collections/club-jerseys`, product needs `club` in categories OR tags

**Fix:**
- Add appropriate category/tag to match the collection you're viewing

### 6. **Cache Issues**
Next.js might be caching old data.

**Fix:**
- In Admin Dashboard, after making changes, clear browser cache
- Or open collection page in incognito/private window
- Or add `?timestamp=123` to URL to bust cache

### 7. **Missing Images**
Products without images might not display properly.

**Check:**
- In Admin Dashboard → Edit Product
- Verify "Images" section has at least one image uploaded
- Check image URLs are valid (not broken)

## Step-by-Step Diagnostic Process

### Step 1: Verify Product Exists and is Active

1. Go to `/admin/products`
2. Search for "AC Milan"
3. Check Status column - should show green "Active" badge
4. If showing gray "Inactive":
   - Click Edit (pencil icon)
   - Scroll to bottom
   - Check "Active" checkbox
   - Click "Update Product"

### Step 2: Check Product Data

1. Click Edit on AC Milan product
2. Verify:
   - ✅ Title is filled
   - ✅ Price is set (4,000 LKR)
   - ✅ At least one size selected (S, M, L, XL shown in screenshot)
   - ✅ At least one category (Signature Embroidery shown)
   - ✅ At least one image uploaded
   - ✅ "Active" checkbox is checked

### Step 3: Check API Response

1. Open browser DevTools (F12)
2. Go to Console tab
3. Run:
```javascript
fetch('/api/products')
  .then(r => r.json())
  .then(data => {
    console.log('Total products:', data.products.totalItems);
    console.log('Products:', data.products.items);
    const acMilan = data.products.items.find(p => 
      p.name.includes('AC MILAN') || p.name.includes('AC Milan')
    );
    if (acMilan) {
      console.log('✅ AC Milan found:', acMilan);
    } else {
      console.log('❌ AC Milan NOT found in API response');
    }
  });
```

### Step 4: Check Collection Filtering

1. Open `/collections` page
2. Check if ANY products are showing
   - If NO products at all: RLS policy issue (see #3 above)
   - If OTHER products show but not AC Milan: Category/tag issue (see #2 above)

### Step 5: Check Supabase Database Directly

1. Go to Supabase Dashboard
2. Navigate to Table Editor → products
3. Find AC Milan row
4. Verify:
   - `is_active` = `true` (checkbox checked)
   - `categories` array is not empty
   - `tags` array is not empty
   - `images` array has at least one URL
   - `slug` is set (not null)

## Quick Fix Checklist

For the AC Milan product specifically:

- [ ] Product exists in database
- [ ] `is_active` = true
- [ ] Has at least one category (e.g., "Signature Embroidery", "Retro", "Club")
- [ ] Has at least one tag
- [ ] Has at least one image
- [ ] Has a slug (auto-generated from title)
- [ ] Price is set correctly
- [ ] RLS policy allows public read access
- [ ] `/api/products` returns the product
- [ ] Collection page filters match product categories/tags

## Testing After Fixes

1. **Test General Collections Page:**
   - Visit `/collections`
   - Should see AC Milan in the grid

2. **Test Specific Collection:**
   - If product has `retro` tag → Visit `/collections/retro`
   - If product has `club` category → Visit `/collections/club-jerseys`
   - Should see AC Milan in filtered results

3. **Test Search:**
   - Visit `/search?q=AC+Milan`
   - Should see AC Milan in search results

4. **Test Product Page:**
   - Click on AC Milan card
   - Should navigate to `/product/[slug]`
   - Should see full product details

## If Still Not Working

### Enable Debug Logging

1. Open `/collections/page.tsx`
2. Add console.log in `loadAllProducts`:

```typescript
const loadAllProducts = async () => {
  setLoading(true);
  try {
    const result = await productOperations.getProducts({ take: 50 });
    console.log('API Result:', result); // ADD THIS
    if (result?.products?.items) {
      console.log('Products count:', result.products.items.length); // ADD THIS
      setProducts(result.products.items);
    }
  } catch (error) {
    console.error('Error loading products:', error);
  } finally {
    setLoading(false);
  }
};
```

2. Open browser console on collections page
3. Check what data is being returned

### Check Network Tab

1. Open DevTools → Network tab
2. Reload collections page
3. Find request to `/api/products`
4. Check:
   - Status code (should be 200)
   - Response data (should have products array)
   - Any error messages

## Most Likely Issue

Based on the screenshot showing:
- Product EXISTS in admin dashboard
- Product shows as ACTIVE (green badge)
- Product has categories ("Signature Embroidery")

**Most likely cause:** Row Level Security (RLS) policy is blocking public access.

**Quick fix:**
Run the RLS policy SQL from section #3 above in Supabase SQL Editor.

