'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/admin/ui/button/Button';
import Input from '@/components/admin/form/input/InputField';
import Label from '@/components/admin/form/Label';
import Badge from '@/components/admin/ui/badge/Badge';
import { Icon } from '@/components/admin/ui/Icon';
import chevronLeftIconSrc from '@/icons/admin/chevron-left.svg';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchCustomer();
  }, [params.id]);

  const fetchCustomer = async () => {
    try {
      const res = await fetch(`/api/admin/customers/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setCustomer(data.customer);
        setAddresses(data.addresses || []);
        setOrders(data.recentOrders || []);
        setFormData(data.customer);
      }
    } catch (error) {
      console.error('Failed to fetch customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/admin/customers/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setEditing(false);
        fetchCustomer();
      }
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!customer) {
    return <div className="p-8 text-center">Customer not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/customers">
          <Button variant="outline" size="sm">
            <Icon src={chevronLeftIconSrc} alt="Back" width={16} height={16} className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Customer Details
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Customer Information
              </h2>
              {!editing && (
                <Button onClick={() => setEditing(true)} size="sm">
                  Edit
                </Button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={formData.first_name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={formData.last_name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={formData.phone_number || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm">
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setEditing(false);
                      setFormData(customer);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {customer.first_name} {customer.last_name}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {customer.email}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Phone</span>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {customer.phone_number || 'N/A'}
                    {customer.phone_verified && (
                      <Badge color="success" className="ml-2">Verified</Badge>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total Orders
                  </span>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {customer.total_orders || 0}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total Spent
                  </span>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {new Intl.NumberFormat('en-LK', {
                      style: 'currency',
                      currency: 'LKR',
                    }).format(Number(customer.total_spent || 0))}
                  </p>
                </div>
              </div>
            )}
          </div>

          {orders.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Recent Orders
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Order Code</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.order_code}</TableCell>
                      <TableCell>
                        {new Date(order.order_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('en-LK', {
                          style: 'currency',
                          currency: 'LKR',
                        }).format(Number(order.total_with_tax || 0))}
                      </TableCell>
                      <TableCell>
                        <Badge color="success">{order.order_state}</Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/orders/${order.order_code}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {addresses.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Addresses
              </h2>
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                    <div className="font-medium text-gray-800 dark:text-white/90">
                      {address.full_name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {address.street_line1}
                      {address.street_line2 && `, ${address.street_line2}`}
                      <br />
                      {address.city}, {address.province} {address.postal_code}
                      <br />
                      {address.country_code}
                    </div>
                    {address.is_default && (
                      <Badge color="success" className="mt-2">Default</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

