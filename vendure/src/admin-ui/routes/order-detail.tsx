import React, { useState, useEffect } from 'react';
import { DeliveryStageBadge } from '../components/DeliveryStageBadge';
import { DataTable } from '../components/DataTable';

interface OrderItem {
  id: string;
  productName: string;
  variantName?: string;
  sku: string;
  quantity: number;
  unitPriceWithTax: number;
  lineTotalWithTax: number;
  patchEnabled: boolean;
  patchType?: string;
  printName?: string;
  printNumber?: string;
}

interface OrderDetail {
  id: string;
  orderCode: string;
  orderDate: string;
  deliveryStage: string;
  paymentMethod?: string;
  paymentStatus?: string;
  subtotal: number;
  taxTotal: number;
  shippingTotal: number;
  totalWithTax: number;
  trackingNumber?: string;
  items: OrderItem[];
  deliveryStatus?: {
    stage: string;
    trackingNumber?: string;
    updatedAt: string;
    history: Array<{
      stage: string;
      updatedAt: string;
      note?: string;
    }>;
  };
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const ORDER_QUERY = `
  query GetOrder($orderCode: String!) {
    supabaseOrderSummary(orderCode: $orderCode) {
      id
      orderCode
      orderDate
      deliveryStage
      paymentMethod
      paymentStatus
      subtotal
      taxTotal
      shippingTotal
      totalWithTax
      trackingNumber
      items {
        id
        productName
        variantName
        sku
        quantity
        unitPriceWithTax
        lineTotalWithTax
        patchEnabled
        patchType
        printName
        printNumber
      }
      deliveryStatus {
        stage
        trackingNumber
        updatedAt
        history {
          stage
          updatedAt
          note
        }
      }
      customer {
        firstName
        lastName
        email
      }
    }
  }
`;

const UPDATE_DELIVERY_STATUS_MUTATION = `
  mutation UpdateDeliveryStatus($input: UpdateDeliveryStatusInput!) {
    updateDeliveryStatus(input: $input) {
      orderCode
      stage
      trackingNumber
      updatedAt
    }
  }
`;

export const OrderDetailPage: React.FC<{ orderCode: string }> = ({ orderCode }) => {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newStage, setNewStage] = useState('');
  const [newTrackingNumber, setNewTrackingNumber] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await fetch('/admin-api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: ORDER_QUERY,
            variables: { orderCode },
          }),
        });
        
        const result = await response.json();
        if (result.data?.supabaseOrderSummary) {
          setOrder(result.data.supabaseOrderSummary);
          setNewStage(result.data.supabaseOrderSummary.deliveryStage);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderCode) {
      fetchOrder();
    }
  }, [orderCode]);

  const handleUpdateDeliveryStatus = async () => {
    setUpdating(true);
    try {
      const response = await fetch('/admin-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: UPDATE_DELIVERY_STATUS_MUTATION,
          variables: {
            input: {
              orderCode,
              stage: newStage,
              trackingNumber: newTrackingNumber || undefined,
            },
          },
        }),
      });
      
      const result = await response.json();
      if (result.data?.updateDeliveryStatus) {
        setShowUpdateForm(false);
        // Refresh order data
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update delivery status:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!order) {
    return <div className="p-6">Order not found</div>;
  }

  const itemColumns = [
    { header: 'Product', accessor: (row: OrderItem) => row.productName },
    { header: 'Variant', accessor: (row: OrderItem) => row.variantName || 'N/A' },
    { header: 'SKU', accessor: 'sku' as keyof OrderItem },
    { header: 'Qty', accessor: 'quantity' as keyof OrderItem },
    { 
      header: 'Price', 
      accessor: (row: OrderItem) => `LKR ${row.unitPriceWithTax.toFixed(2)}` 
    },
    { 
      header: 'Total', 
      accessor: (row: OrderItem) => `LKR ${row.lineTotalWithTax.toFixed(2)}` 
    },
    { 
      header: 'Customization', 
      accessor: (row: OrderItem) => {
        const parts = [];
        if (row.patchEnabled && row.patchType) parts.push(`Patch: ${row.patchType}`);
        if (row.printName) parts.push(`Name: ${row.printName}`);
        if (row.printNumber) parts.push(`#${row.printNumber}`);
        return parts.length > 0 ? parts.join(', ') : 'None';
      }
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Orders
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Order {order.orderCode}</h1>
            <p className="text-gray-600">
              {new Date(order.orderDate).toLocaleDateString()}
            </p>
          </div>
          <DeliveryStageBadge stage={order.deliveryStage} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="font-semibold mb-3">Customer Information</h2>
          {order.customer ? (
            <div className="space-y-1 text-sm">
              <p><strong>Name:</strong> {order.customer.firstName} {order.customer.lastName}</p>
              <p><strong>Email:</strong> {order.customer.email}</p>
            </div>
          ) : (
            <p className="text-gray-500">No customer data</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h2 className="font-semibold mb-3">Payment Information</h2>
          <div className="space-y-1 text-sm">
            <p><strong>Method:</strong> {order.paymentMethod || 'N/A'}</p>
            <p><strong>Status:</strong> {order.paymentStatus || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Order Items</h2>
        </div>
        <DataTable data={order.items} columns={itemColumns} />
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Order Summary</h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>LKR {order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>LKR {order.taxTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>LKR {order.shippingTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total:</span>
            <span>LKR {order.totalWithTax.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Delivery Status</h2>
          <button
            onClick={() => setShowUpdateForm(!showUpdateForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showUpdateForm ? 'Cancel' : 'Update Status'}
          </button>
        </div>

        {showUpdateForm && (
          <div className="bg-white p-4 rounded-lg border mb-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Stage</label>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="ORDER_CONFIRMED">Order Confirmed</option>
                  <option value="SOURCING">Sourcing</option>
                  <option value="ARRIVED">Arrived</option>
                  <option value="DISPATCHED">Dispatched</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tracking Number</label>
                <input
                  type="text"
                  value={newTrackingNumber}
                  onChange={(e) => setNewTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <button
                onClick={handleUpdateDeliveryStatus}
                disabled={updating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}

        {order.deliveryStatus && (
          <div className="bg-white p-4 rounded-lg border">
            <div className="mb-3">
              <p className="text-sm text-gray-600">Current Status</p>
              <div className="mt-1">
                <DeliveryStageBadge stage={order.deliveryStatus.stage} />
              </div>
              {order.deliveryStatus.trackingNumber && (
                <p className="text-sm mt-2">
                  <strong>Tracking:</strong> {order.deliveryStatus.trackingNumber}
                </p>
              )}
            </div>

            {order.deliveryStatus.history && order.deliveryStatus.history.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">History</p>
                <div className="space-y-2">
                  {order.deliveryStatus.history.map((event, index) => (
                    <div key={index} className="text-sm border-l-2 pl-3">
                      <DeliveryStageBadge stage={event.stage} />
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(event.updatedAt).toLocaleString()}
                      </p>
                      {event.note && (
                        <p className="text-gray-600 text-xs mt-1">{event.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

