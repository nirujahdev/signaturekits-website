'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DailyStats {
  date: string;
  new_customers: number;
  returning_customers: number;
  new_customer_revenue: number;
  returning_customer_revenue: number;
}

interface CustomerAcquisitionChartProps {
  timeline: DailyStats[];
  summary: {
    total_new_customers: number;
    total_returning_customers: number;
    new_customer_revenue: number;
    returning_customer_revenue: number;
  };
}

export function CustomerAcquisitionChart({ timeline, summary }: CustomerAcquisitionChartProps) {
  const chartData = timeline.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    new: day.new_customers,
    returning: day.returning_customers,
    newRevenue: day.new_customer_revenue,
    returningRevenue: day.returning_customer_revenue,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">New Customers</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {summary.total_new_customers}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Returning Customers</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {summary.total_returning_customers}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">New Customer Revenue</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            LKR {summary.new_customer_revenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Returning Customer Revenue</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            LKR {summary.returning_customer_revenue.toLocaleString()}
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="new" 
            stackId="1" 
            stroke="#3b82f6" 
            fill="#3b82f6" 
            name="New Customers"
          />
          <Area 
            type="monotone" 
            dataKey="returning" 
            stackId="1" 
            stroke="#10b981" 
            fill="#10b981" 
            name="Returning Customers"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

