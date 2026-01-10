'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

interface WishlistItem {
  id: string;
  customer_id: string;
  product_id: string;
  added_at: string;
  notes: string | null;
  customers: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
  products: {
    id: string;
    title: string;
    slug: string;
    price: number;
  };
}

export default function WishlistsPage() {
  const [wishlists, setWishlists] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [customerFilter, setCustomerFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (customerFilter) params.set('customer_id', customerFilter);
      if (productFilter) params.set('product_id', productFilter);
      params.set('limit', '100');

      const res = await fetch(`/api/admin/wishlists?${params}`);
      if (res.ok) {
        const data = await res.json();
        setWishlists(data.wishlists || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching wishlists:', error);
      toast.error('Failed to load wishlists');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this item from the wishlist?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/wishlists/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Wishlist item removed');
        fetchWishlists();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to remove wishlist item');
      }
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
      toast.error('Failed to remove wishlist item');
    }
  };

  // Get popular products
  const popularProducts = wishlists.reduce((acc, item) => {
    const productId = item.product_id;
    if (!acc[productId]) {
      acc[productId] = {
        product: item.products,
        count: 0,
      };
    }
    acc[productId].count++;
    return acc;
  }, {} as Record<string, { product: any; count: number }>);

  const topProducts = Object.values(popularProducts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wishlist Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage customer wishlists
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Filter by Customer ID"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
          />
          <Input
            placeholder="Filter by Product ID"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
          />
          <Button onClick={fetchWishlists}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Popular Products */}
      {topProducts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Most Wishlisted Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topProducts.map((item) => (
              <div
                key={item.product.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <p className="font-semibold">{item.product.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.count} {item.count === 1 ? 'wishlist' : 'wishlists'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wishlist Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total: {total} wishlist {total === 1 ? 'item' : 'items'}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold">Customer</th>
                  <th className="text-left p-4 text-sm font-semibold">Product</th>
                  <th className="text-left p-4 text-sm font-semibold">Added</th>
                  <th className="text-left p-4 text-sm font-semibold">Notes</th>
                  <th className="text-right p-4 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wishlists.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium">
                          {item.customers.first_name} {item.customers.last_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.customers.email}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{item.products.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          LKR {item.products.price.toLocaleString()}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(item.added_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                      {item.notes || '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {wishlists.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No wishlist items found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

