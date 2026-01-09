'use client';

import { useEffect, useState } from 'react';
import { EcommerceMetrics } from '@/components/admin/ecommerce/EcommerceMetrics';
import RecentOrders from '@/components/admin/ecommerce/RecentOrders';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Overview of your e-commerce platform
        </p>
      </div>

      <EcommerceMetrics stats={stats} loading={loading} />
      
      <div>
        <RecentOrders />
      </div>
    </div>
  );
}
