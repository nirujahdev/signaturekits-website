'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueTrend {
  period: string;
  revenue: number;
  order_count: number;
  average_order_value: number;
}

interface RevenueTrendsChartProps {
  trends: RevenueTrend[];
  growth: number;
  total_revenue: number;
  total_orders: number;
}

export function RevenueTrendsChart({ trends, growth, total_revenue, total_orders }: RevenueTrendsChartProps) {
  const chartData = trends.map(trend => ({
    period: trend.period,
    revenue: trend.revenue,
    orders: trend.order_count,
    aov: trend.average_order_value,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            LKR {total_revenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {total_orders}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Average Order Value</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            LKR {total_orders > 0 ? (total_revenue / total_orders).toLocaleString() : '0'}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${growth >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <p className="text-sm text-gray-600 dark:text-gray-400">Growth</p>
          <p className={`text-2xl font-bold ${growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip 
            formatter={(value: number, name: string) => {
              if (name === 'revenue') {
                return [`LKR ${value.toLocaleString()}`, 'Revenue'];
              }
              if (name === 'aov') {
                return [`LKR ${value.toLocaleString()}`, 'Avg Order Value'];
              }
              return [value, name === 'orders' ? 'Orders' : name];
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Revenue (LKR)"
          />
          <Line 
            type="monotone" 
            dataKey="orders" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

