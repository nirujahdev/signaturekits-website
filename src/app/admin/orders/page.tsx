'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Force dynamic rendering to prevent RSC prefetching
export const dynamic = 'force-dynamic';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table';
import Badge from '@/components/admin/ui/badge/Badge';
import Input from '@/components/admin/form/input/InputField';
import Button from '@/components/admin/ui/button/Button';
import { BoxIcon, EyeIcon, DownloadIcon } from '@/icons/admin/index';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page, search, statusFilter]);

  const fetchOrders = async (retryCount = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });
      const res = await fetch(`/api/admin/orders?${params}`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } else if (res.status === 404 && retryCount < 2) {
        // Retry on 404 with a small delay
        setTimeout(() => fetchOrders(retryCount + 1), 1000);
        return;
      } else {
        console.error('Failed to fetch orders:', res.status, res.statusText);
        setOrders([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      if (retryCount < 2) {
        setTimeout(() => fetchOrders(retryCount + 1), 1000);
        return;
      }
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
          Orders
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage and track all orders
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search orders by code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-11 w-full md:w-48 rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        >
          <option value="">All Status</option>
          <option value="PaymentAuthorized">Authorized</option>
          <option value="PaymentSettled">Settled</option>
          <option value="Fulfilled">Fulfilled</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <Button
          onClick={async () => {
            try {
              const params = new URLSearchParams({
                ...(search && { search }),
                ...(statusFilter && { status: statusFilter }),
              });
              const res = await fetch(`/api/admin/reports/sales?${params}&format=csv`);
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `orders-export-${Date.now()}.csv`;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            } catch (error) {
              console.error('Export failed:', error);
            }
          }}
          variant="outline"
          startIcon={<DownloadIcon className="w-4 h-4" />}
        >
          Export CSV
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {loading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-12 bg-gray-200 rounded dark:bg-gray-800 flex-1" />
                  <div className="h-12 bg-gray-200 rounded dark:bg-gray-800 flex-1" />
                  <div className="h-12 bg-gray-200 rounded dark:bg-gray-800 flex-1" />
                  <div className="h-12 bg-gray-200 rounded dark:bg-gray-800 flex-1" />
                  <div className="h-12 bg-gray-200 rounded dark:bg-gray-800 flex-1" />
                </div>
              ))}
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Order Code</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_code}</TableCell>
                  <TableCell>
                    {new Date(order.order_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.order_code}</TableCell>
                  <TableCell>
                    <Badge color="success">{order.payment_method || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(Number(order.total_with_tax || 0))}</TableCell>
                  <TableCell>
                    <Badge color="success">{order.order_state}</Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/orders/${order.order_code}`}>
                      <Button size="sm" variant="outline" startIcon={<EyeIcon className="w-4 h-4" />}>
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            size="sm"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

