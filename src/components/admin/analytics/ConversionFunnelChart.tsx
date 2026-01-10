'use client';

import { FunnelChart, Funnel, LabelList, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface FunnelData {
  cart_sessions: number;
  checkout_sessions: number;
  completed_orders: number;
  abandoned_cart: number;
  abandoned_checkout: number;
  cart_to_checkout_rate: number;
  checkout_to_order_rate: number;
  overall_conversion_rate: number;
  average_order_value: number;
}

interface ConversionFunnelChartProps {
  funnel: FunnelData;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export function ConversionFunnelChart({ funnel }: ConversionFunnelChartProps) {
  const funnelData = [
    {
      name: 'Cart Sessions',
      value: funnel.cart_sessions,
      fill: COLORS[0],
    },
    {
      name: 'Checkout Sessions',
      value: funnel.checkout_sessions,
      fill: COLORS[1],
    },
    {
      name: 'Completed Orders',
      value: funnel.completed_orders,
      fill: COLORS[2],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Cart to Checkout</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {funnel.cart_to_checkout_rate.toFixed(1)}%
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Checkout to Order</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {funnel.checkout_to_order_rate.toFixed(1)}%
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Overall Conversion</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {funnel.overall_conversion_rate.toFixed(1)}%
          </p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Order Value</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            LKR {funnel.average_order_value.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 border rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cart Sessions</p>
          <p className="text-3xl font-bold">{funnel.cart_sessions.toLocaleString()}</p>
        </div>
        <div className="text-center p-4 border rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Checkout Sessions</p>
          <p className="text-3xl font-bold">{funnel.checkout_sessions.toLocaleString()}</p>
        </div>
        <div className="text-center p-4 border rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Completed Orders</p>
          <p className="text-3xl font-bold">{funnel.completed_orders.toLocaleString()}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Abandoned Cart</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {funnel.abandoned_cart.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Abandoned Checkout</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {funnel.abandoned_checkout.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

