'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatPrice } from '@/lib/products';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  currency_code: string;
  sizes: string[];
  categories: string[];
  tags: string[];
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  loading?: boolean;
  selectedProducts?: Set<string>;
  onSelectAll?: (checked: boolean) => void;
  onSelectProduct?: (id: string, checked: boolean) => void;
}

export function ProductTable({
  products,
  onDelete,
  loading,
  selectedProducts = new Set(),
  onSelectAll,
  onSelectProduct,
}: ProductTableProps) {
  const handleSelectAll = (checked: boolean) => {
    if (onSelectAll) {
      onSelectAll(checked);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      onDelete(id);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading products...</p>
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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {onSelectAll && (
              <th className="w-12 p-3">
                <Checkbox
                  checked={products.length > 0 && products.every((p) => selectedProducts.has(p.id))}
                  onCheckedChange={handleSelectAll}
                />
              </th>
            )}
            <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Image
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Title
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Price
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Categories
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tags
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Sizes
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Status
            </th>
            <th className="text-right p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                selectedProducts.has(product.id) ? 'bg-brand-50 dark:bg-brand-900/10' : ''
              }`}
            >
              {onSelectProduct && (
                <td className="p-3">
                  <Checkbox
                    checked={selectedProducts.has(product.id)}
                    onCheckedChange={(checked) => onSelectProduct(product.id, checked as boolean)}
                  />
                </td>
              )}
              <td className="p-3">
                <div className="w-16 h-16 relative rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No image
                    </div>
                  )}
                </div>
              </td>
              <td className="p-3">
                <div>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {product.title}
                  </Link>
                  {product.is_featured && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded">
                      Featured
                    </span>
                  )}
                </div>
              </td>
              <td className="p-3 text-gray-700 dark:text-gray-300">
                {formatPrice(product.price, product.currency_code)}
              </td>
              <td className="p-3">
                <div className="flex flex-wrap gap-1">
                  {product.categories && product.categories.length > 0 ? (
                    product.categories.slice(0, 2).map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded"
                      >
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                  {product.categories && product.categories.length > 2 && (
                    <span className="text-xs text-gray-400">
                      +{product.categories.length - 2}
                    </span>
                  )}
                </div>
              </td>
              <td className="p-3">
                <div className="flex flex-wrap gap-1">
                  {product.tags && product.tags.length > 0 ? (
                    product.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                  {product.tags && product.tags.length > 2 && (
                    <span className="text-xs text-gray-400">
                      +{product.tags.length - 2}
                    </span>
                  )}
                </div>
              </td>
              <td className="p-3">
                <div className="flex flex-wrap gap-1">
                  {product.sizes && product.sizes.length > 0 ? (
                    product.sizes.slice(0, 4).map((size, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                      >
                        {size}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                  {product.sizes && product.sizes.length > 4 && (
                    <span className="text-xs text-gray-400">
                      +{product.sizes.length - 4}
                    </span>
                  )}
                </div>
              </td>
              <td className="p-3">
                {product.is_active ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded">
                    <Eye className="w-3 h-3" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    <EyeOff className="w-3 h-3" />
                    Inactive
                  </span>
                )}
              </td>
              <td className="p-3">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/products/${product.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

