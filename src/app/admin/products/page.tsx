'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductTable } from '@/components/admin/products/ProductTable';
import { toast } from 'sonner';

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

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<string>('');
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [page, search, categoryFilter, statusFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (search) params.append('search', search);
      if (categoryFilter) params.append('category', categoryFilter);
      if (statusFilter) params.append('is_active', statusFilter);

      const response = await fetch(`/api/admin/products?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      setProducts(data.products || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete product');
      }

      toast.success('Product deleted successfully');
      fetchProducts();
      setSelectedProducts(new Set());
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const handleBulkAction = async () => {
    if (selectedProducts.size === 0) {
      toast.error('Please select at least one product');
      return;
    }

    if (!bulkAction) {
      toast.error('Please select an action');
      return;
    }

    setBulkLoading(true);
    try {
      const productIds = Array.from(selectedProducts);

      if (bulkAction === 'delete') {
        if (!confirm(`Are you sure you want to delete ${productIds.length} product(s)?`)) {
          setBulkLoading(false);
          return;
        }

        const deletePromises = productIds.map((id) =>
          fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
        );

        const results = await Promise.allSettled(deletePromises);
        const failed = results.filter((r) => r.status === 'rejected').length;

        if (failed === 0) {
          toast.success(`Successfully deleted ${productIds.length} product(s)`);
        } else {
          toast.error(`Failed to delete ${failed} product(s)`);
        }
      } else if (bulkAction === 'activate' || bulkAction === 'deactivate') {
        const isActive = bulkAction === 'activate';
        const updatePromises = productIds.map((id) =>
          fetch(`/api/admin/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_active: isActive }),
          })
        );

        const results = await Promise.allSettled(updatePromises);
        const failed = results.filter((r) => r.status === 'rejected').length;

        if (failed === 0) {
          toast.success(
            `Successfully ${isActive ? 'activated' : 'deactivated'} ${productIds.length} product(s)`
          );
        } else {
          toast.error(`Failed to update ${failed} product(s)`);
        }
      }

      setSelectedProducts(new Set());
      setBulkAction('');
      fetchProducts();
    } catch (error: any) {
      console.error('Bulk action error:', error);
      toast.error(error.message || 'Failed to perform bulk action');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(products.map((p) => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleSelectProduct = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedProducts(newSelected);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your product catalog ({total} total)
          </p>
        </div>
        <Button onClick={() => router.push('/admin/products/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Product
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
          <div>
            <Input
              placeholder="Filter by category..."
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.size > 0 && (
        <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedProducts.size} product(s) selected
            </span>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              disabled={bulkLoading}
            >
              <option value="">Select action...</option>
              <option value="activate">Activate</option>
              <option value="deactivate">Deactivate</option>
              <option value="delete">Delete</option>
            </select>
            <Button
              onClick={handleBulkAction}
              disabled={!bulkAction || bulkLoading}
              size="sm"
            >
              {bulkLoading ? 'Processing...' : 'Apply'}
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedProducts(new Set())}
          >
            Clear Selection
          </Button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <ProductTable
          products={products}
          onDelete={handleDelete}
          loading={loading}
          selectedProducts={selectedProducts}
          onSelectAll={handleSelectAll}
          onSelectProduct={handleSelectProduct}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

