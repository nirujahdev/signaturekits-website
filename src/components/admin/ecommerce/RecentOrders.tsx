import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Link from "next/link";


export default function RecentOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add a small delay to ensure auth is ready
    const timer = setTimeout(() => {
      fetchRecentOrders();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders?limit=5');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else if (res.status === 404) {
        // API route not found - show empty state
        console.warn('Orders API route not found (404)');
        setOrders([]);
      } else {
        // Other error - show empty state
        console.warn('Orders API returned:', res.status);
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch recent orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-card">
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="admin-card-title">
            Recent Orders
          </h3>
          <p className="admin-card-description mt-1">
            Latest customer orders and their status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="admin-button admin-button-outline">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
          <Link href="/admin/orders" className="admin-button admin-button-primary">
            See all
          </Link>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
        <Table className="admin-table">
          {/* Table Header */}
          <TableHeader>
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Order Code
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Date
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Payment
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Total
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No recent orders</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Orders will appear here once customers start placing them</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <TableCell className="py-4">
                    <p className="font-semibold text-gray-900 dark:text-white/90">
                      {order.order_code}
                    </p>
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.order_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium">
                    {order.payment_method || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="font-semibold text-gray-900 dark:text-white/90">
                    {new Intl.NumberFormat('en-LK', {
                      style: 'currency',
                      currency: 'LKR',
                      minimumFractionDigits: 0,
                    }).format(Number(order.total_with_tax || 0))}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge size="sm" color="success">
                      {order.order_state}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Link 
                      href={`/admin/orders/${order.order_code}`} 
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 text-sm font-medium transition-colors"
                    >
                      View →
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
