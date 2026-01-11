"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { Icon } from "../ui/Icon";
import boxIconLineSrc from "@/icons/admin/box-line.svg";
import groupIconSrc from "@/icons/admin/group.svg";
import dollarLineIconSrc from "@/icons/admin/dollar-line.svg";

interface EcommerceMetricsProps {
  stats?: {
    totalCustomers: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
  };
  loading?: boolean;
}

export const EcommerceMetrics: React.FC<EcommerceMetricsProps> = ({ stats, loading }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="admin-card animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-xl dark:bg-gray-800 mb-5" />
            <div className="h-4 w-20 bg-gray-200 rounded dark:bg-gray-800 mb-2" />
            <div className="h-8 w-24 bg-gray-200 rounded dark:bg-gray-800" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {/* Customers */}
      <div className="admin-card group hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-brand-100 to-brand-200 rounded-xl dark:from-brand-900/30 dark:to-brand-800/30 group-hover:scale-105 transition-transform">
            <Icon src={groupIconSrc} alt="Customers" width={28} height={28} className="text-brand-600 dark:text-brand-400" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Customers
          </p>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white/90">
              {stats?.totalCustomers.toLocaleString() || 0}
            </h4>
        </div>
      </div>

      {/* Orders */}
      <div className="admin-card group hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl dark:from-blue-900/30 dark:to-blue-800/30 group-hover:scale-105 transition-transform">
            <Icon src={boxIconLineSrc} alt="Orders" width={28} height={28} className="text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Orders
          </p>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white/90">
              {stats?.totalOrders.toLocaleString() || 0}
            </h4>
        </div>
      </div>

      {/* Revenue */}
      <div className="admin-card group hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl dark:from-green-900/30 dark:to-green-800/30 group-hover:scale-105 transition-transform">
            <Icon src={dollarLineIconSrc} alt="Revenue" width={28} height={28} className="text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Revenue
          </p>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white/90">
              {formatCurrency(stats?.totalRevenue || 0)}
            </h4>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="admin-card group hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl dark:from-amber-900/30 dark:to-amber-800/30 group-hover:scale-105 transition-transform">
            <Icon src={boxIconLineSrc} alt="Pending Orders" width={28} height={28} className="text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Pending Orders
          </p>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white/90">
              {stats?.pendingOrders.toLocaleString() || 0}
            </h4>
        </div>
      </div>
    </div>
  );
};
