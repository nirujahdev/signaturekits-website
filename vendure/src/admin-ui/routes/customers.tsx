import React, { useState, useEffect } from 'react';
import { DataTable } from '../components/DataTable';
import { CustomerCard } from '../components/CustomerCard';

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  phoneVerified: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  isActive: boolean;
}

const CUSTOMERS_QUERY = `
  query GetCustomers($options: CustomerListOptions) {
    supabaseCustomers(options: $options) {
      items {
        id
        email
        firstName
        lastName
        phoneNumber
        phoneVerified
        totalOrders
        totalSpent
        lastOrderDate
        isActive
      }
      totalItems
    }
  }
`;

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skip, setSkip] = useState(0);
  const [take] = useState(20);
  const [totalItems, setTotalItems] = useState(0);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // This would use Vendure's GraphQL client
      // For now, this is a placeholder structure
      const response = await fetch('/admin-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: CUSTOMERS_QUERY,
          variables: {
            options: {
              skip,
              take,
              search: search || undefined,
            },
          },
        }),
      });
      
      const result = await response.json();
      if (result.data?.supabaseCustomers) {
        setCustomers(result.data.supabaseCustomers.items);
        setTotalItems(result.data.supabaseCustomers.totalItems);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [skip, search]);

  const columns = [
    { header: 'Name', accessor: (row: Customer) => `${row.firstName} ${row.lastName}` },
    { header: 'Email', accessor: 'email' as keyof Customer },
    { header: 'Phone', accessor: 'phoneNumber' as keyof Customer },
    { 
      header: 'Verified', 
      accessor: (row: Customer) => row.phoneVerified ? 'Yes' : 'No' 
    },
    { header: 'Orders', accessor: 'totalOrders' as keyof Customer },
    { 
      header: 'Total Spent', 
      accessor: (row: Customer) => `LKR ${row.totalSpent.toFixed(2)}` 
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Customers</h1>
        
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSkip(0);
            }}
            className="px-4 py-2 border rounded-lg flex-1 max-w-md"
          />
        </div>
      </div>

      <DataTable
        data={customers}
        columns={columns}
        loading={loading}
        onRowClick={(customer) => {
          // Navigate to customer detail
          window.location.href = `/admin/extensions/supabase/customers/${customer.id}`;
        }}
      />

      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {skip + 1} to {Math.min(skip + take, totalItems)} of {totalItems} customers
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

