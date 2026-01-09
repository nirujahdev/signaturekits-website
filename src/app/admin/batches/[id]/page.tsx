'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/admin/ui/button/Button';
import Badge from '@/components/admin/ui/badge/Badge';
import { ChevronLeftIcon, DownloadIcon } from '@/icons/admin/index';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table';

export default function BatchDetailPage() {
  const params = useParams();
  const [batch, setBatch] = useState<any>(null);
  const [assignedOrders, setAssignedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchBatch();
  }, [params.id]);

  const fetchBatch = async () => {
    try {
      const res = await fetch(`/api/admin/batches/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setBatch(data.batch);
        setAssignedOrders(data.assignedOrders || []);
        setStatus(data.batch?.status || '');
      }
    } catch (error) {
      console.error('Failed to fetch batch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const res = await fetch(`/api/admin/batches/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchBatch();
      }
    } catch (error) {
      console.error('Failed to update batch:', error);
    }
  };

  const handleExport = async () => {
    // Export supplier purchase list
    window.open(`/api/admin/batches/${params.id}/export`, '_blank');
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!batch) {
    return <div className="p-8 text-center">Batch not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/batches">
          <Button variant="outline" size="sm">
            <ChevronLeftIcon className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Batch {batch.batch_number}
          </h1>
        </div>
        <Button onClick={handleExport} startIcon={<DownloadIcon className="w-4 h-4" />}>
          Export Supplier List
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Assigned Orders
            </h2>
            {assignedOrders.length === 0 ? (
              <p className="text-gray-500">No orders assigned to this batch</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Order Code</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedOrders.map((assignment: any) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        {assignment.customer_orders_summary?.order_code || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {assignment.customer_orders_summary?.order_date
                          ? new Date(assignment.customer_orders_summary.order_date).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {assignment.customer_orders_summary?.total_with_tax
                          ? new Intl.NumberFormat('en-LK', {
                              style: 'currency',
                              currency: 'LKR',
                            }).format(Number(assignment.customer_orders_summary.total_with_tax))
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/orders/${assignment.customer_orders_summary?.order_code}`}
                        >
                          <Button size="sm" variant="outline">
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
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Batch Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  <option value="collecting">Collecting</option>
                  <option value="orderedFromSupplier">Ordered from Supplier</option>
                  <option value="inTransit">In Transit</option>
                  <option value="arrived">Arrived</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button onClick={handleUpdateStatus} size="sm" className="mt-2 w-full" type="button">
                  Update Status
                </Button>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Order Count
                </span>
                <p className="font-medium">{batch.order_count || 0}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Target Count
                </span>
                <p className="font-medium">{batch.target_order_count || 20}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

