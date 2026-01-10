'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

// Force dynamic rendering to prevent RSC prefetching
export const dynamic = 'force-dynamic';
import { EcommerceMetrics } from '@/components/admin/ecommerce/EcommerceMetrics';
import RecentOrders from '@/components/admin/ecommerce/RecentOrders';
import { RevenueChart } from '@/components/admin/analytics/RevenueChart';
import { OrderStatusChart } from '@/components/admin/analytics/OrderStatusChart';
import { CustomerGrowthChart } from '@/components/admin/analytics/CustomerGrowthChart';
import { TopProductsTable } from '@/components/admin/analytics/TopProductsTable';
import { SalesTrends } from '@/components/admin/analytics/SalesTrends';
import Button from '@/components/admin/ui/button/Button';

type Period = 'today' | 'week' | 'month' | 'year' | 'all';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAdminAuth();
  const [period, setPeriod] = useState<Period>('month');
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    averageOrderValue: 0,
    todayOrders: 0,
    todayRevenue: 0,
    statusBreakdown: {} as Record<string, number>,
  });
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardStats();
      fetchAnalytics();
    }
  }, [authLoading, user, period]);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(`/api/admin/dashboard/stats?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        console.warn('Dashboard stats API returned:', res.status);
        setStats({
          totalCustomers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          averageOrderValue: 0,
          todayOrders: 0,
          todayRevenue: 0,
          statusBreakdown: {},
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setStats({
        totalCustomers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        averageOrderValue: 0,
        todayOrders: 0,
        todayRevenue: 0,
        statusBreakdown: {},
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/admin/dashboard/analytics?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Overview of your e-commerce platform
          </p>
        </div>
        <div className="flex gap-2">
          {(['today', 'week', 'month', 'year', 'all'] as Period[]).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={period === p ? 'primary' : 'outline'}
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <EcommerceMetrics stats={stats} loading={loading} />

      {/* Sales Trends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SalesTrends
          current={stats.totalRevenue}
          previous={stats.todayRevenue * 30}
          label="Revenue"
          formatValue={(value) =>
            new Intl.NumberFormat('en-LK', {
              style: 'currency',
              currency: 'LKR',
              minimumFractionDigits: 0,
            }).format(value)
          }
        />
        <SalesTrends
          current={stats.totalOrders}
          previous={stats.todayOrders * 30}
          label="Orders"
        />
        <SalesTrends
          current={stats.averageOrderValue}
          previous={stats.averageOrderValue * 0.9}
          label="Avg Order Value"
          formatValue={(value) =>
            new Intl.NumberFormat('en-LK', {
              style: 'currency',
              currency: 'LKR',
              minimumFractionDigits: 0,
            }).format(value)
          }
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Revenue Trends
          </h2>
          <RevenueChart
            data={analytics?.revenueTrends || []}
            loading={analyticsLoading}
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Order Status Distribution
          </h2>
          <OrderStatusChart
            data={analytics?.statusBreakdown || []}
            loading={analyticsLoading}
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Customer Growth
          </h2>
          <CustomerGrowthChart
            data={analytics?.customerGrowth || []}
            loading={analyticsLoading}
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Top Products
          </h2>
          <TopProductsTable
            data={analytics?.topProducts || []}
            loading={analyticsLoading}
          />
        </div>
      </div>

      <div>
        <RecentOrders />
      </div>
    </div>
  );
}
