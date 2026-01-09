import React, { useState, useEffect } from 'react';
import { DataTable } from '../components/DataTable';
import { DeliveryStageBadge } from '../components/DeliveryStageBadge';

interface Order {
  id: string;
  orderCode: string;
  orderDate: string;
  deliveryStage: string;
  paymentMethod?: string;
  paymentStatus?: string;
  totalWithTax: number;
  trackingNumber?: string;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const ORDERS_QUERY = `
  query GetOrders($options: OrderListOptions) {
    supabaseOrders(options: $options) {
      items {
        id
        orderCode
        orderDate
        deliveryStage
        paymentMethod
        paymentStatus
        totalWithTax
        trackingNumber
        customer {
          firstName
          lastName
          email
        }
      }
      totalItems
    }
  }
`;

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [take] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [deliveryStageFilter, setDeliveryStageFilter] = useState<string>('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/admin-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: ORDERS_QUERY,
          variables: {
            options: {
              skip,
              take,
              deliveryStage: deliveryStageFilter || undefined,
              paymentMethod: paymentMethodFilter || undefined,
            },
          },
        }),
      });
      
      const result = await response.json();
      if (result.data?.supabaseOrders) {
        setOrders(result.data.supabaseOrders.items);
        setTotalItems(result.data.supabaseOrders.totalItems);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [skip, deliveryStageFilter, paymentMethodFilter]);

  const columns = [
    { header: 'Order Code', accessor: 'orderCode' as keyof Order },
    { 
      header: 'Date', 
      accessor: (row: Order) => new Date(row.orderDate).toLocaleDateString() 
    },
    { 
      header: 'Customer', 
      accessor: (row: Order) => row.customer 
        ? `${row.customer.firstName} ${row.customer.lastName}`
        : 'N/A'
    },
    { 
      header: 'Stage', 
      accessor: (row: Order) => <DeliveryStageBadge stage={row.deliveryStage} />
    },
    { 
      header: 'Payment', 
      accessor: (row: Order) => row.paymentMethod || 'N/A' 
    },
    { 
      header: 'Total', 
      accessor: (row: Order) => `LKR ${row.totalWithTax.toFixed(2)}` 
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        
        <div className="flex gap-4 mb-4">
          <select
            value={deliveryStageFilter}
            onChange={(e) => {
              setDeliveryStageFilter(e.target.value);
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

          <select
            value={paymentMethodFilter}
            onChange={(e) => {
              setPaymentMethodFilter(e.target.value);
              setSkip(0);
            }}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Payment Methods</option>
            <option value="payhere">PayHere</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>
      </div>

      <DataTable
        data={orders}
        columns={columns}
        loading={loading}
        onRowClick={(order) => {
          window.location.href = `/admin/extensions/supabase/orders/${order.orderCode}`;
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

