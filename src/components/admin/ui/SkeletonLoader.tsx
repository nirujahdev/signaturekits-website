'use client';

import React from 'react';

interface SkeletonLoaderProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonLoader({ rows = 5, columns = 6, className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-3">
        {/* Header skeleton */}
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded dark:bg-gray-800 flex-1" />
          ))}
        </div>
        {/* Rows skeleton */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-12 bg-gray-200 rounded dark:bg-gray-800 flex-1"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
      <div className="h-12 w-12 bg-gray-200 rounded-xl dark:bg-gray-800 mb-5" />
      <div className="h-4 w-20 bg-gray-200 rounded dark:bg-gray-800 mb-2" />
      <div className="h-8 w-24 bg-gray-200 rounded dark:bg-gray-800" />
    </div>
  );
}

