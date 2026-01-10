'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/admin/ui/button/Button';
import Badge from '@/components/admin/ui/badge/Badge';
import { ListIcon, PlusIcon } from '@/icons/admin/index';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table';

export default function BatchesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [targetCount, setTargetCount] = useState(20);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async (retryCount = 0) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/batches', {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setBatches(data.batches || []);
      } else if (res.status === 404 && retryCount < 2) {
        setTimeout(() => fetchBatches(retryCount + 1), 1000);
        return;
      } else {
        console.error('Failed to fetch batches:', res.status);
        setBatches([]);
      }
    } catch (error) {
      console.error('Failed to fetch batches:', error);
      if (retryCount < 2) {
        setTimeout(() => fetchBatches(retryCount + 1), 1000);
        return;
      }
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async () => {
    try {
      const res = await fetch('/api/admin/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_order_count: targetCount }),
      });
      if (res.ok) {
        setShowCreateModal(false);
        fetchBatches();
      }
    } catch (error) {
      console.error('Failed to create batch:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      collecting: 'warning',
      orderedFromSupplier: 'info',
      inTransit: 'info',
      arrived: 'success',
      dispatched: 'success',
      completed: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
            Import Batches
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage pre-order batches for supplier imports
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} startIcon={<PlusIcon className="w-4 h-4" />}>
          Create Batch
        </Button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Create New Batch</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Order Count
                </label>
                <input
                  type="number"
                  value={targetCount}
                  onChange={(e) => setTargetCount(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateBatch} className="flex-1">
                  Create
                </Button>
                <Button
                  onClick={() => setShowCreateModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : batches.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No batches found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Batch Number</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Orders</TableCell>
                <TableCell>Target</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.batch_number}</TableCell>
                  <TableCell>
                    <Badge color={getStatusColor(batch.status)}>
                      {batch.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{batch.order_count || 0}</TableCell>
                  <TableCell>{batch.target_order_count || 20}</TableCell>
                  <TableCell>
                    {new Date(batch.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/batches/${batch.id}`}>
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
  );
}

