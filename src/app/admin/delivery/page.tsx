'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/admin/ui/button/Button';
import Badge from '@/components/admin/ui/badge/Badge';
import Input from '@/components/admin/form/input/InputField';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table';

const DELIVERY_STAGES = [
  { value: 'ORDER_CONFIRMED', label: 'Order Confirmed' },
  { value: 'SOURCING', label: 'Sourcing' },
  { value: 'ARRIVED', label: 'Arrived' },
  { value: 'DISPATCHED', label: 'Dispatched' },
  { value: 'DELIVERED', label: 'Delivered' },
];

export default function DeliveryPage() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState('');
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    stage: '',
    tracking_number: '',
    note: '',
  });

  useEffect(() => {
    fetchDeliveries();
  }, [stageFilter]);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (stageFilter) params.set('stage', stageFilter);
      const res = await fetch(`/api/admin/delivery?${params}`);
      if (res.ok) {
        const data = await res.json();
        setDeliveries(data.deliveries || []);
      }
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (orderCode: string, currentData: any) => {
    setEditingOrder(orderCode);
    setEditData({
      stage: currentData.stage || 'ORDER_CONFIRMED',
      tracking_number: currentData.tracking_number || '',
      note: currentData.note || '',
    });
  };

  const handleSave = async () => {
    if (!editingOrder) return;

    try {
      const res = await fetch(`/api/admin/delivery/${editingOrder}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        setEditingOrder(null);
        fetchDeliveries();
      }
    } catch (error) {
      console.error('Failed to update delivery:', error);
    }
  };

  const getStageLabel = (stage: string) => {
    return DELIVERY_STAGES.find((s) => s.value === stage)?.label || stage;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
          Delivery Tracking
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track and update order delivery status
        </p>
      </div>

      <div className="flex gap-4">
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        >
          <option value="">All Stages</option>
          {DELIVERY_STAGES.map((stage) => (
            <option key={stage.value} value={stage.value}>
              {stage.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : deliveries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No deliveries found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Order Code</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Tracking Number</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery: any) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">
                    {delivery.order_code}
                  </TableCell>
                  <TableCell>
                    <Badge color="success">{getStageLabel(delivery.stage)}</Badge>
                  </TableCell>
                  <TableCell>
                    {delivery.tracking_number || (
                      <span className="text-gray-400">Not set</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(delivery.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {editingOrder === delivery.order_code ? (
                      <div className="flex gap-2">
                        <Button onClick={handleSave} size="sm">
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingOrder(null)}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleEdit(delivery.order_code, delivery)}
                        size="sm"
                        variant="outline"
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Update Delivery Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Stage</label>
                <select
                  value={editData.stage}
                  onChange={(e) =>
                    setEditData({ ...editData, stage: e.target.value })
                  }
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  {DELIVERY_STAGES.map((stage) => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tracking Number
                </label>
                <Input
                  value={editData.tracking_number}
                  onChange={(e) =>
                    setEditData({ ...editData, tracking_number: e.target.value })
                  }
                  placeholder="Enter tracking number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Note</label>
                <Input
                  value={editData.note}
                  onChange={(e) =>
                    setEditData({ ...editData, note: e.target.value })
                  }
                  placeholder="Optional note"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  Save
                </Button>
                <Button
                  onClick={() => setEditingOrder(null)}
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
    </div>
  );
}

