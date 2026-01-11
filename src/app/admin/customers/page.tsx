'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table';
import Badge from '@/components/admin/ui/badge/Badge';
import Input from '@/components/admin/form/input/InputField';
import Button from '@/components/admin/ui/button/Button';
import { Icon } from '@/components/admin/ui/Icon';
import userCircleIconSrc from '@/icons/admin/user-circle.svg';
import pencilIconSrc from '@/icons/admin/pencil.svg';
import eyeIconSrc from '@/icons/admin/eye.svg';
import downloadIconSrc from '@/icons/admin/download.svg';

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  phone_verified: boolean;
  total_orders: number;
  total_spent: number;
  created_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

  const fetchCustomers = async (retryCount = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
      });
      const res = await fetch(`/api/admin/customers?${params}`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } else if (res.status === 404 && retryCount < 2) {
        setTimeout(() => fetchCustomers(retryCount + 1), 1000);
        return;
      } else {
        console.error('Failed to fetch customers:', res.status);
        setCustomers([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      if (retryCount < 2) {
        setTimeout(() => fetchCustomers(retryCount + 1), 1000);
        return;
      }
      setCustomers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
            Customers
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your customer database
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search customers by email or name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Button
          onClick={async () => {
            try {
              const params = new URLSearchParams({
                ...(search && { search }),
                format: 'csv',
              });
              const res = await fetch(`/api/admin/reports/customers?${params}`);
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `customers-export-${Date.now()}.csv`;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            } catch (error) {
              console.error('Export failed:', error);
            }
          }}
          variant="outline"
          startIcon={<Icon src={downloadIconSrc} alt="Download" width={16} height={16} className="w-4 h-4" />}
        >
          Export CSV
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {loading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-12 bg-gray-200 rounded dark:bg-gray-800 flex-1" />
                  <div className="h-12 bg-gray-200 rounded dark:bg-gray-800 flex-1" />
                  <div className="h-12 bg-gray-200 rounded dark:bg-gray-800 flex-1" />
                  <div className="h-12 bg-gray-200 rounded dark:bg-gray-800 flex-1" />
                  <div className="h-12 bg-gray-200 rounded dark:bg-gray-800 flex-1" />
                </div>
              ))}
            </div>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No customers found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Orders</TableCell>
                <TableCell>Total Spent</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full dark:bg-gray-800">
                        <Icon src={userCircleIconSrc} alt="User" width={24} height={24} className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white/90">
                          {customer.first_name} {customer.last_name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{customer.phone_number || 'N/A'}</span>
                      {customer.phone_verified && (
                        <Badge color="success">Verified</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{customer.total_orders || 0}</TableCell>
                  <TableCell>{formatCurrency(Number(customer.total_spent || 0))}</TableCell>
                  <TableCell>
                    <Badge color="success">Active</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/customers/${customer.id}`}>
                        <Button size="sm" variant="outline" startIcon={<Icon src={eyeIconSrc} alt="View" width={16} height={16} className="w-4 h-4" />}>
                          View
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            size="sm"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

