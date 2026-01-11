'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_value: number | null;
  maximum_discount: number | null;
  usage_limit: number | null;
  usage_count: number;
  user_limit: number | null;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  applicable_categories: string[];
  applicable_products: string[];
  created_at: string;
}

export default function DiscountCodesPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterActive, setFilterActive] = useState<string | null>(null);

  useEffect(() => {
    fetchCodes();
  }, [filterActive]);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const url = filterActive !== null 
        ? `/api/admin/discount-codes?is_active=${filterActive}`
        : '/api/admin/discount-codes';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCodes(data.discount_codes || []);
      } else {
        toast.error('Failed to load discount codes');
      }
    } catch (error) {
      console.error('Error fetching discount codes:', error);
      toast.error('Failed to load discount codes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete discount code "${code}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/discount-codes/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Discount code deleted');
        fetchCodes();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete discount code');
      }
    } catch (error) {
      console.error('Error deleting discount code:', error);
      toast.error('Failed to delete discount code');
    }
  };

  const formatDiscount = (code: DiscountCode) => {
    if (code.discount_type === 'percentage') {
      return `${code.discount_value}%`;
    }
    return `LKR ${code.discount_value.toLocaleString()}`;
  };

  const isExpired = (code: DiscountCode) => {
    return new Date(code.valid_until) < new Date();
  };

  const isUpcoming = (code: DiscountCode) => {
    return new Date(code.valid_from) > new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Discount Codes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage discount codes for your store
          </p>
        </div>
        <Link href="/admin/discount-codes/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Discount Code
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filterActive === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterActive(null)}
        >
          All
        </Button>
        <Button
          variant={filterActive === 'true' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterActive('true')}
        >
          Active
        </Button>
        <Button
          variant={filterActive === 'false' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterActive('false')}
        >
          Inactive
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : codes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500">No discount codes found</p>
          <Link href="/admin/discount-codes/new">
            <Button className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Create First Discount Code
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Code
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Discount
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Usage
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Validity
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {codes.map((code) => (
                  <tr
                    key={code.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {code.code}
                        </p>
                        {code.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {code.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDiscount(code)}
                        </p>
                        {code.minimum_order_value && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Min: LKR {code.minimum_order_value.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-gray-900 dark:text-white">
                          {code.usage_count} / {code.usage_limit || '∞'}
                        </p>
                        {code.user_limit && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {code.user_limit} per customer
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="text-gray-900 dark:text-white">
                          {new Date(code.valid_from).toLocaleDateString()}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          to {new Date(code.valid_until).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {!code.is_active && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                        {isExpired(code) && (
                          <Badge variant="destructive">Expired</Badge>
                        )}
                        {isUpcoming(code) && (
                          <Badge variant="outline">Upcoming</Badge>
                        )}
                        {code.is_active && !isExpired(code) && !isUpcoming(code) && (
                          <Badge variant="default">Active</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/discount-codes/${code.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/discount-codes/${code.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(code.id, code.code)}
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
        </div>
      )}
    </div>
  );
}

