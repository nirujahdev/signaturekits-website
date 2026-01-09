import React, { useState, useEffect } from 'react';
import { DeliveryStageBadge } from '../components/DeliveryStageBadge';
import { DataTable } from '../components/DataTable';

interface CustomerDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  phoneVerified: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  addresses: Array<{
    id: string;
    fullName: string;
    streetLine1: string;
    city: string;
    countryCode: string;
    addressType: string;
  }>;
  orders: Array<{
    id: string;
    orderCode: string;
    orderDate: string;
    deliveryStage: string;
    totalWithTax: number;
  }>;
}

const CUSTOMER_QUERY = `
  query GetCustomer($id: ID!) {
    supabaseCustomer(id: $id) {
      id
      email
      firstName
      lastName
      phoneNumber
      phoneVerified
      totalOrders
      totalSpent
      lastOrderDate
      addresses {
        id
        fullName
        streetLine1
        city
        countryCode
        addressType
      }
      orders {
        id
        orderCode
        orderDate
        deliveryStage
        totalWithTax
      }
    }
  }
`;

export const CustomerDetailPage: React.FC<{ customerId: string }> = ({ customerId }) => {
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const response = await fetch('/admin-api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: CUSTOMER_QUERY,
            variables: { id: customerId },
          }),
        });
        
        const result = await response.json();
        if (result.data?.supabaseCustomer) {
          setCustomer(result.data.supabaseCustomer);
        }
      } catch (error) {
        console.error('Failed to fetch customer:', error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!customer) {
    return <div className="p-6">Customer not found</div>;
  }

  const orderColumns = [
    { header: 'Order Code', accessor: 'orderCode' as keyof CustomerDetail['orders'][0] },
    { 
      header: 'Date', 
      accessor: (row: CustomerDetail['orders'][0]) => new Date(row.orderDate).toLocaleDateString() 
    },
    { 
      header: 'Stage', 
      accessor: (row: CustomerDetail['orders'][0]) => (
        <DeliveryStageBadge stage={row.deliveryStage} />
      )
    },
    { 
      header: 'Total', 
      accessor: (row: CustomerDetail['orders'][0]) => `LKR ${row.totalWithTax.toFixed(2)}` 
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Customers
        </button>
        <h1 className="text-2xl font-bold">
          {customer.firstName} {customer.lastName}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="font-semibold mb-3">Contact Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> {customer.email}</p>
            {customer.phoneNumber && (
              <p>
                <strong>Phone:</strong> {customer.phoneNumber}
                {customer.phoneVerified ? (
                  <span className="ml-2 text-green-600">✓ Verified</span>
                ) : (
                  <span className="ml-2 text-orange-600">(Unverified)</span>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h2 className="font-semibold mb-3">Statistics</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Total Orders:</strong> {customer.totalOrders}</p>
            <p><strong>Total Spent:</strong> LKR {customer.totalSpent.toFixed(2)}</p>
            {customer.lastOrderDate && (
              <p><strong>Last Order:</strong> {new Date(customer.lastOrderDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>

      {customer.addresses.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Addresses</h2>
          <div className="space-y-2">
            {customer.addresses.map((address) => (
              <div key={address.id} className="bg-white p-4 rounded-lg border">
                <p className="font-medium">{address.fullName}</p>
                <p className="text-sm text-gray-600">
                  {address.streetLine1}, {address.city}, {address.countryCode}
                </p>
                <p className="text-xs text-gray-500 mt-1">{address.addressType}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-3">Order History</h2>
        <DataTable
          data={customer.orders}
          columns={orderColumns}
          onRowClick={(order) => {
            window.location.href = `/admin/extensions/supabase/orders/${order.orderCode}`;
          }}
        />
      </div>
    </div>
  );
};

