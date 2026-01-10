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
      <div className="p-8 text-center text-gray-500">Loading products...</div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">No product data available</div>
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
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Quantity Sold</TableCell>
            <TableCell>Revenue</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product, index) => (
            <TableRow key={product.name}>
              <TableCell className="font-medium">#{index + 1}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.quantity.toLocaleString()}</TableCell>
              <TableCell className="font-semibold">
                {formatCurrency(product.revenue)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

