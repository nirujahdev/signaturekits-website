'use client';

import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';

interface AbandonedCart {
  id: string;
  phone: string;
  customer_email: string | null;
  customer_name: string | null;
  created_at: string;
  hours_since_abandoned: number;
}

interface AbandonedCartsTableProps {
  carts: AbandonedCart[];
  loading?: boolean;
}

export function AbandonedCartsTable({ carts, loading }: AbandonedCartsTableProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading abandoned carts...</p>
      </div>
    );
  }

  if (carts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No abandoned carts found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Customer
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Phone
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Abandoned
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Hours Ago
            </th>
          </tr>
        </thead>
        <tbody>
          {carts.map((cart) => (
            <tr
              key={cart.id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td className="p-3">
                {cart.customer_name ? (
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {cart.customer_name}
                    </p>
                    {cart.customer_email && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {cart.customer_email}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">Guest</span>
                )}
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{cart.phone}</span>
                </div>
              </td>
              <td className="p-3 text-gray-600 dark:text-gray-400">
                {new Date(cart.created_at).toLocaleString()}
              </td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-sm ${
                  cart.hours_since_abandoned > 24 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                    : cart.hours_since_abandoned > 12
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                }`}>
                  {cart.hours_since_abandoned}h ago
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

