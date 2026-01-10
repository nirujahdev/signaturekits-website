'use client';

import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@/icons/admin/index';

interface SalesTrendsProps {
  current: number;
  previous: number;
  label: string;
  formatValue?: (value: number) => string;
}

export function SalesTrends({ current, previous, label, formatValue }: SalesTrendsProps) {
  const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  const isPositive = change >= 0;
  const defaultFormat = (value: number) => value.toLocaleString();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <ArrowUpIcon className="w-4 h-4" />
          ) : (
            <ArrowDownIcon className="w-4 h-4" />
          )}
          <span className="text-sm font-semibold">{Math.abs(change).toFixed(1)}%</span>
        </div>
      </div>
      <div className="space-y-1">
        <div>
          <span className="text-xs text-gray-400">Current</span>
          <p className="text-lg font-bold text-gray-800 dark:text-white/90">
            {(formatValue || defaultFormat)(current)}
          </p>
        </div>
        <div>
          <span className="text-xs text-gray-400">Previous</span>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {(formatValue || defaultFormat)(previous)}
          </p>
        </div>
      </div>
    </div>
  );
}

