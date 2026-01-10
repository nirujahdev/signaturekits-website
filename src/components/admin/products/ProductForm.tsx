'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from './ImageUpload';
import { CategorySelector } from './CategorySelector';
import { TagSelector } from './TagSelector';
import { AVAILABLE_SIZES } from '@/lib/products';
import { Loader2 } from 'lucide-react';

interface Product {
  id?: string;
  title: string;
  slug?: string;
  description?: string;
  price: number;
  currency_code?: string;
  sizes: string[];
  sku?: string;
  categories: string[];
  tags: string[];
  images: string[];
  is_active?: boolean;
  is_featured?: boolean;
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  onCancel?: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Partial<Product>>({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price || 0,
    currency_code: product?.currency_code || 'LKR',
    sizes: product?.sizes || [],
    sku: product?.sku || '',
    categories: product?.categories || [],
    tags: product?.tags || [],
    images: product?.images || [],
    is_active: product?.is_active !== undefined ? product.is_active : true,
    is_featured: product?.is_featured || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = 'Title is required';
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.sizes && formData.sizes.length === 0) {
      newErrors.sizes = 'At least one size must be selected';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error: any) {
      console.error('Form submission error:', error);
      setErrors({ submit: error.message || 'Failed to save product' });
    } finally {
      setLoading(false);
    }
  };

  const handleSizeToggle = (size: string) => {
    const currentSizes = formData.sizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    setFormData({ ...formData, sizes: newSizes });
    if (errors.sizes) {
      setErrors({ ...errors, sizes: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <Label htmlFor="title">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
            if (errors.title) setErrors({ ...errors, title: '' });
          }}
          placeholder="e.g., AC Milan 06/07 Home Jersey"
          required
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Product description..."
          rows={4}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {/* Price and Currency */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">
            Price (LKR) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => {
              setFormData({ ...formData, price: parseFloat(e.target.value) || 0 });
              if (errors.price) setErrors({ ...errors, price: '' });
            }}
            required
            className={errors.price ? 'border-red-500' : ''}
          />
          {errors.price && (
            <p className="text-sm text-red-500 mt-1">{errors.price}</p>
          )}
        </div>
        <div>
          <Label htmlFor="currency_code">Currency</Label>
          <Input
            id="currency_code"
            value={formData.currency_code || 'LKR'}
            onChange={(e) => setFormData({ ...formData, currency_code: e.target.value })}
            maxLength={3}
          />
        </div>
      </div>

      {/* SKU */}
      <div>
        <Label htmlFor="sku">SKU (Optional)</Label>
        <Input
          id="sku"
          value={formData.sku || ''}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          placeholder="Leave empty for N/A"
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty if SKU is not applicable
        </p>
      </div>

      {/* Sizes */}
      <div>
        <Label>
          Sizes <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mt-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = formData.sizes?.includes(size);
            return (
              <label
                key={size}
                className={`flex items-center justify-center p-2 rounded border cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-500 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSizeToggle(size)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{size}</span>
              </label>
            );
          })}
        </div>
        {errors.sizes && (
          <p className="text-sm text-red-500 mt-1">{errors.sizes}</p>
        )}
        {formData.sizes && formData.sizes.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {formData.sizes.length} size{formData.sizes.length !== 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      {/* Categories */}
      <CategorySelector
        selectedCategories={formData.categories || []}
        onCategoriesChange={(categories) =>
          setFormData({ ...formData, categories })
        }
      />

      {/* Tags */}
      <TagSelector
        selectedTags={formData.tags || []}
        onTagsChange={(tags) => setFormData({ ...formData, tags })}
      />

      {/* Images */}
      <ImageUpload
        images={formData.images || []}
        onImagesChange={(images) => setFormData({ ...formData, images })}
        productId={product?.id}
      />

      {/* Status Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_active !== false}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm">Active</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_featured || false}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm">Featured</span>
        </label>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-800 dark:text-red-200">{errors.submit}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {product ? 'Update Product' : 'Create Product'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        {!onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/products')}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

