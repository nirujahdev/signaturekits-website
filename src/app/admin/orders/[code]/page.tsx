'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/admin/ui/button/Button';
import Badge from '@/components/admin/ui/badge/Badge';
import { ChevronLeftIcon } from '@/icons/admin/index';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table';

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [deliveryStatus, setDeliveryStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [params.code]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${params.code}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setItems(data.items || []);
        setDeliveryStatus(data.deliveryStatus);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!order) {
    return <div className="p-8 text-center">Order not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="outline" size="sm">
            <ChevronLeftIcon className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Order {order.order_code}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Order Items
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Variant</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.product_name}</div>
                        {item.patch_enabled && (
                          <div className="text-sm text-gray-500">
                            Patch: {item.patch_type}
                          </div>
                        )}
                        {item.print_name && (
                          <div className="text-sm text-gray-500">
                            Name: {item.print_name} #{item.print_number}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.variant_name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-LK', {
                        style: 'currency',
                        currency: 'LKR',
                      }).format(Number(item.unit_price || 0))}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-LK', {
                        style: 'currency',
                        currency: 'LKR',
                      }).format(Number(item.line_total || 0))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('en-LK', {
                    style: 'currency',
                    currency: 'LKR',
                  }).format(Number(order.subtotal || 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('en-LK', {
                    style: 'currency',
                    currency: 'LKR',
                  }).format(Number(order.tax_total || 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('en-LK', {
                    style: 'currency',
                    currency: 'LKR',
                  }).format(Number(order.shipping_total || 0))}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-lg">
                  {new Intl.NumberFormat('en-LK', {
                    style: 'currency',
                    currency: 'LKR',
                  }).format(Number(order.total_with_tax || 0))}
                </span>
              </div>
            </div>
          </div>

          {deliveryStatus && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Delivery Status
              </h2>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Stage</span>
                  <div className="mt-1">
                    <Badge color="success">{deliveryStatus.stage}</Badge>
                  </div>
                </div>
                {deliveryStatus.tracking_number && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Tracking Number
                    </span>
                    <p className="font-medium">{deliveryStatus.tracking_number}</p>
                  </div>
                )}
                <Link href={`/admin/delivery?order=${order.order_code}`}>
                  <Button size="sm" className="w-full mt-4">
                    Update Delivery Status
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

