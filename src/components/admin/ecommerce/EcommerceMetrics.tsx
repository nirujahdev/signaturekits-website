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
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
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
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Icon src={groupIconSrc} alt="Customers" width={24} height={24} className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-2xl dark:text-white/90">
              {stats?.totalCustomers.toLocaleString() || 0}
            </h4>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Icon src={boxIconLineSrc} alt="Orders" width={24} height={24} className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-2xl dark:text-white/90">
              {stats?.totalOrders.toLocaleString() || 0}
            </h4>
          </div>
        </div>
      </div>

      {/* Revenue */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Icon src={dollarLineIconSrc} alt="Revenue" width={24} height={24} className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Revenue
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-2xl dark:text-white/90">
              {formatCurrency(stats?.totalRevenue || 0)}
            </h4>
          </div>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Icon src={boxIconLineSrc} alt="Orders" width={24} height={24} className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pending Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-2xl dark:text-white/90">
              {stats?.pendingOrders.toLocaleString() || 0}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
