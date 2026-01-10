'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProductSales {
  product_id: string;
  product_name: string;
  total_quantity: number;
  total_revenue: number;
  order_count: number;
  average_order_value: number;
}

interface SalesByProductChartProps {
  data: ProductSales[];
  period: string;
}

export function SalesByProductChart({ data, period }: SalesByProductChartProps) {
  const chartData = data.map(product => ({
    name: product.product_name.length > 20 
      ? product.product_name.substring(0, 20) + '...' 
      : product.product_name,
    revenue: product.total_revenue,
    quantity: product.total_quantity,
    orders: product.order_count,
  }));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Sales by Product ({period})</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={100}
            fontSize={12}
          />
          <YAxis />
          <Tooltip 
            formatter={(value: number, name: string) => {
              if (name === 'revenue') {
                return [`LKR ${value.toLocaleString()}`, 'Revenue'];
              }
              return [value, name === 'quantity' ? 'Quantity' : 'Orders'];
            }}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (LKR)" />
          <Bar dataKey="quantity" fill="#10b981" name="Quantity" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

