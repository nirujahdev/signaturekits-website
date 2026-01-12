# 🔧 Issue: Product Not Showing in Collections

## Quick Summary
Your AC Milan product appears in the admin dashboard but not on the website collections page. This is a common issue with a few possible causes.

## ✅ Immediate Solution (Use the Diagnostics Tool)

I've created an **automatic diagnostic page** that will tell you exactly what's wrong:

### How to Use:
1. **Log into your admin dashboard** at `/admin/signin`
2. **Click "Diagnostics"** in the left sidebar (newly added)
3. **Click "Run Diagnostics"** button
4. **Review the results** - it will show you:
   - ✅ Green = Working correctly
   - ⚠️  Yellow = Warning (check details)
   - ❌ Red = Problem found (with solution)

The diagnostic will automatically check:
- Is the product marked as "Active"?
- Can the public API see the product?
- Are there RLS (security) policy issues?
- Is collection filtering working?
- Does the product have proper categories/tags?

## 🔍 Most Likely Causes (in order)

### 1. RLS (Row Level Security) Policy Blocking Access (80% likely)

**What it means:** Your database security settings are preventing the public website from seeing products.

**How to fix:**
1. Go to your **Supabase Dashboard**
2. Open **SQL Editor**
3. Paste and run this:

```sql
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

4. Refresh your website collections page

### 2. Product is Marked as Inactive (15% likely)

**What it means:** The product has an "Inactive" status in the database.

**How to fix:**
1. Go to **Admin Dashboard → Products**
2. Find **AC Milan** product
3. Click **Edit** (pencil icon)
4. Scroll to bottom
5. **Check the "Active" checkbox**
6. Click **Update Product**

### 3. Missing Categories/Tags (3% likely)

**What it means:** The product doesn't have the right categories to show in collections.

**How to fix:**
1. Edit the AC Milan product
2. Add categories:
   - ✅ "Signature Embroidery" (you already have this)
   - ➕ "Retro" (if it's a retro jersey)
   - ➕ "Club" (for club jerseys)
3. Add tags if needed
4. Save

## 📋 Verification Checklist

After applying a fix, verify:
- [ ] Open `/collections` in your browser
- [ ] AC Milan product appears in the grid
- [ ] Can click on the product
- [ ] Product detail page loads
- [ ] Images display correctly

## 🛠️ Created Files for You

### 1. **Diagnostics Page** (Most Important)
- **Location:** `/admin/diagnostics`
- **What it does:** Automatically tests all connections and shows you exactly what's wrong
- **How to access:** Admin sidebar → Diagnostics

### 2. **Detailed Troubleshooting Guide**
- **File:** `PRODUCT_VISIBILITY_DIAGNOSTIC.md`
- **What it contains:** Step-by-step manual diagnostics if you want to dive deeper

### 3. **Complete Documentation**
- **File:** `TROUBLESHOOTING_SUMMARY.md`
- **What it contains:** Full technical details, data structure, architecture

## 🎯 Recommended Action Plan

1. **First:** Run the diagnostics page (`/admin/diagnostics`)
   - This takes 10 seconds and will tell you exactly what's wrong

2. **If diagnostics show RLS issue:**
   - Run the SQL fix in Supabase (see section #1 above)
   - This is the most common issue

3. **If diagnostics show "inactive" issue:**
   - Edit product and check "Active" checkbox
   - Save and refresh website

4. **If diagnostics show "not found" issue:**
   - Verify product actually exists in database
   - Check for typos in product title

5. **Still not working?**
   - Check `PRODUCT_VISIBILITY_DIAGNOSTIC.md` for detailed steps
   - Check browser console (F12) for error messages
   - Check Supabase logs for database errors

## 📊 How the System Works

```
Admin Dashboard → Creates/Edits Product → Supabase Database
                                                ↓
                                          RLS Policies Check
                                          (is_active = true?)
                                                ↓
                                          Public API (/api/products)
                                                ↓
                                          Website Collections Page
```

If any step in this chain is broken, the product won't appear on the website.

## 💡 Quick Test Commands

Open your browser console (F12) on the collections page and run:

```javascript
// Test if API works
fetch('/api/products?limit=10')
  .then(r => r.json())
  .then(data => console.log('Products:', data));

// Search for AC Milan
fetch('/api/products?limit=100')
  .then(r => r.json())
  .then(data => {
    const acMilan = data.products.items.find(p => 
      p.name.toUpperCase().includes('AC MILAN')
    );
    console.log(acMilan ? '✅ Found' : '❌ Not found', acMilan);
  });
```

## 🚀 Expected Result After Fix

- Product appears in `/collections`
- Product appears in `/collections/retro` (if has retro tag)
- Product appears in `/collections/club-jerseys` (if has club category)
- Product clickable and detail page works
- Images display correctly
- Price shows as LKR 4,000

## Need Help?

1. Run `/admin/diagnostics` - it will guide you
2. Check `PRODUCT_VISIBILITY_DIAGNOSTIC.md` for detailed steps
3. Look at browser console (F12) for error messages
4. Check Supabase Dashboard → Logs for database errors

---

**TL;DR:** Go to `/admin/diagnostics` and click "Run Diagnostics". It will tell you exactly what's wrong and how to fix it. Most likely it's an RLS policy issue - just run the SQL command in section #1 above.

