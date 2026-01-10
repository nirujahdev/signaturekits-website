'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategorySales {
  category: string;
  total_quantity: number;
  total_revenue: number;
  order_count: number;
  product_count: number;
}

interface SalesByCategoryChartProps {
  data: CategorySales[];
  period: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export function SalesByCategoryChart({ data, period }: SalesByCategoryChartProps) {
  const chartData = data.map(cat => ({
    name: cat.category,
    value: cat.total_revenue,
    quantity: cat.total_quantity,
    orders: cat.order_count,
  }));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Sales by Category ({period})</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => `LKR ${value.toLocaleString()}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

