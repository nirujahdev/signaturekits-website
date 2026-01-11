'use client';

import { useState, useEffect, useCallback } from 'react';
import { SalesByProductChart } from '@/components/admin/analytics/SalesByProductChart';
import { SalesByCategoryChart } from '@/components/admin/analytics/SalesByCategoryChart';
import { CustomerAcquisitionChart } from '@/components/admin/analytics/CustomerAcquisitionChart';
import { RevenueTrendsChart } from '@/components/admin/analytics/RevenueTrendsChart';
import { ConversionFunnelChart } from '@/components/admin/analytics/ConversionFunnelChart';
import { AbandonedCartsTable } from '@/components/admin/analytics/AbandonedCartsTable';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type Period = 'today' | 'week' | 'month' | 'year' | 'all';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('month');
  const [loading, setLoading] = useState(true);

  // Sales by Product
  const [salesByProduct, setSalesByProduct] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Sales by Category
  const [salesByCategory, setSalesByCategory] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Customer Acquisition
  const [customerAcquisition, setCustomerAcquisition] = useState<any>(null);
  const [loadingAcquisition, setLoadingAcquisition] = useState(true);

  // Revenue Trends
  const [revenueTrends, setRevenueTrends] = useState<any>(null);
  const [loadingTrends, setLoadingTrends] = useState(true);

  // Conversion Funnel
  const [conversionFunnel, setConversionFunnel] = useState<any>(null);
  const [loadingFunnel, setLoadingFunnel] = useState(true);

  // Abandoned Carts
  const [abandonedCarts, setAbandonedCarts] = useState<any[]>([]);
  const [loadingCarts, setLoadingCarts] = useState(true);

  const fetchSalesByProduct = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`/api/admin/analytics/sales-by-product?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setSalesByProduct(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching sales by product:', error);
    } finally {
      setLoadingProducts(false);
    }
  }, [period]);

  const fetchSalesByCategory = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch(`/api/admin/analytics/sales-by-category?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setSalesByCategory(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching sales by category:', error);
    } finally {
      setLoadingCategories(false);
    }
  }, [period]);

  const fetchCustomerAcquisition = useCallback(async () => {
    setLoadingAcquisition(true);
    try {
      const res = await fetch(`/api/admin/analytics/customer-acquisition?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setCustomerAcquisition(data);
      }
    } catch (error) {
      console.error('Error fetching customer acquisition:', error);
    } finally {
      setLoadingAcquisition(false);
    }
  }, [period]);

  const fetchRevenueTrends = useCallback(async () => {
    setLoadingTrends(true);
    try {
      const res = await fetch(`/api/admin/analytics/revenue-trends?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setRevenueTrends(data);
      }
    } catch (error) {
      console.error('Error fetching revenue trends:', error);
    } finally {
      setLoadingTrends(false);
    }
  }, [period]);

  const fetchConversionFunnel = useCallback(async () => {
    setLoadingFunnel(true);
    try {
      const res = await fetch(`/api/admin/analytics/conversion-funnel?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setConversionFunnel(data.funnel);
      }
    } catch (error) {
      console.error('Error fetching conversion funnel:', error);
    } finally {
      setLoadingFunnel(false);
    }
  }, [period]);

  const fetchAbandonedCarts = useCallback(async () => {
    setLoadingCarts(true);
    try {
      const res = await fetch(`/api/admin/analytics/abandoned-carts?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setAbandonedCarts(data.abandoned_carts || []);
      }
    } catch (error) {
      console.error('Error fetching abandoned carts:', error);
    } finally {
      setLoadingCarts(false);
    }
  }, [period]);

  const fetchAllAnalytics = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchSalesByProduct(),
      fetchSalesByCategory(),
      fetchCustomerAcquisition(),
      fetchRevenueTrends(),
      fetchConversionFunnel(),
      fetchAbandonedCarts(),
    ]);
    setLoading(false);
  }, [fetchSalesByProduct, fetchSalesByCategory, fetchCustomerAcquisition, fetchRevenueTrends, fetchConversionFunnel, fetchAbandonedCarts]);

  useEffect(() => {
    fetchAllAnalytics();
  }, [fetchAllAnalytics]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics & Insights</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive analytics dashboard for your business
          </p>
        </div>
        <div className="flex gap-2">
          {(['today', 'week', 'month', 'year', 'all'] as Period[]).map((p) => (
            <Button
              key={p}
              variant={period === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Revenue Trends */}
          {revenueTrends && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <RevenueTrendsChart {...revenueTrends} />
            </div>
          )}

          {/* Sales by Product */}
          {!loadingProducts && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <SalesByProductChart data={salesByProduct} period={period} />
            </div>
          )}

          {/* Sales by Category */}
          {!loadingCategories && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <SalesByCategoryChart data={salesByCategory} period={period} />
            </div>
          )}

          {/* Customer Acquisition */}
          {customerAcquisition && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <CustomerAcquisitionChart {...customerAcquisition} />
            </div>
          )}

          {/* Conversion Funnel */}
          {conversionFunnel && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <ConversionFunnelChart funnel={conversionFunnel} />
            </div>
          )}

          {/* Abandoned Carts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Abandoned Carts</h2>
            <AbandonedCartsTable carts={abandonedCarts} loading={loadingCarts} />
          </div>
        </div>
      )}
    </div>
  );
}

