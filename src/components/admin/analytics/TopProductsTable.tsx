'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table';

interface TopProductsTableProps {
  data: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  loading?: boolean;
}

export function TopProductsTable({ data, loading }: TopProductsTableProps) {
  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent mb-4"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading products...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p className="text-sm text-gray-500 dark:text-gray-400">No product data available</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <Table className="admin-table">
        <TableHeader>
          <TableRow>
            <TableCell className="py-3 font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Rank</TableCell>
            <TableCell className="py-3 font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Product Name</TableCell>
            <TableCell className="py-3 font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Quantity Sold</TableCell>
            <TableCell className="py-3 font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Revenue</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product, index) => (
            <TableRow key={product.name} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
              <TableCell className="py-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-semibold text-sm">
                  {index + 1}
                </span>
              </TableCell>
              <TableCell className="py-4 font-medium text-gray-900 dark:text-white/90">{product.name}</TableCell>
              <TableCell className="py-4 text-gray-600 dark:text-gray-400">{product.quantity.toLocaleString()}</TableCell>
              <TableCell className="py-4 font-semibold text-gray-900 dark:text-white/90">
                {formatCurrency(product.revenue)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

