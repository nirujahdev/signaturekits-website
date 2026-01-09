import React, { useState, useEffect } from 'react';
import { DataTable } from '../components/DataTable';
import { DeliveryStageBadge } from '../components/DeliveryStageBadge';

interface DeliveryStatus {
  id: string;
  orderCode: string;
  stage: string;
  trackingNumber?: string;
  note?: string;
  updatedAt: string;
  history?: Array<{
    stage: string;
    updatedAt: string;
    note?: string;
  }>;
}

const DELIVERY_STATUSES_QUERY = `
  query GetDeliveryStatuses($options: DeliveryStatusListOptions) {
    supabaseAllDeliveryStatuses(options: $options) {
      items {
        id
        orderCode
        stage
        trackingNumber
        note
        updatedAt
      }
      totalItems
    }
  }
`;

export const DeliveryTrackingPage: React.FC = () => {
  const [statuses, setStatuses] = useState<DeliveryStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [take] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [stageFilter, setStageFilter] = useState<string>('');

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/admin-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: DELIVERY_STATUSES_QUERY,
          variables: {
            options: {
              skip,
              take,
              stage: stageFilter || undefined,
            },
          },
        }),
      });
      
      const result = await response.json();
      if (result.data?.supabaseAllDeliveryStatuses) {
        setStatuses(result.data.supabaseAllDeliveryStatuses.items);
        setTotalItems(result.data.supabaseAllDeliveryStatuses.totalItems);
      }
    } catch (error) {
      console.error('Failed to fetch delivery statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, [skip, stageFilter]);

  const columns = [
    { header: 'Order Code', accessor: 'orderCode' as keyof DeliveryStatus },
    { 
      header: 'Stage', 
      accessor: (row: DeliveryStatus) => <DeliveryStageBadge stage={row.stage} />
    },
    { 
      header: 'Tracking Number', 
      accessor: (row: DeliveryStatus) => row.trackingNumber || 'N/A' 
    },
    { 
      header: 'Last Updated', 
      accessor: (row: DeliveryStatus) => new Date(row.updatedAt).toLocaleString() 
    },
    { 
      header: 'Note', 
      accessor: (row: DeliveryStatus) => row.note || 'N/A' 
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Delivery Tracking</h1>
        
        <div className="flex gap-4 mb-4">
          <select
            value={stageFilter}
            onChange={(e) => {
              setStageFilter(e.target.value);
              setSkip(0);
            }}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Stages</option>
            <option value="ORDER_CONFIRMED">Order Confirmed</option>
            <option value="SOURCING">Sourcing</option>
            <option value="ARRIVED">Arrived</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      </div>

      <DataTable
        data={statuses}
        columns={columns}
        loading={loading}
        onRowClick={(status) => {
          window.location.href = `/admin/extensions/supabase/orders/${status.orderCode}`;
        }}
      />

      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {skip + 1} to {Math.min(skip + take, totalItems)} of {totalItems} orders
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setSkip(Math.max(0, skip - take))}
            disabled={skip === 0}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setSkip(skip + take)}
            disabled={skip + take >= totalItems}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

