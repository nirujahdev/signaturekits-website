'use client';

import { useState } from 'react';
import Button from '@/components/admin/ui/button/Button';

// Force dynamic rendering to prevent RSC prefetching
export const dynamic = 'force-dynamic';
import Input from '@/components/admin/form/input/InputField';
import { DownloadIcon, FileIcon } from '@/icons/admin/index';

type ReportType = 'sales' | 'customers' | 'products';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('sales');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const generateReport = async (format: 'json' | 'csv' = 'json') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        format,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const res = await fetch(`/api/admin/reports/${reportType}?${params}`);
      
      if (format === 'csv') {
        // Download CSV
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}-report-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await res.json();
        setReportData(data);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
          Reports
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Generate and export detailed reports
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report Configuration */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Report Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                className="w-full h-11 rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option value="sales">Sales Report</option>
                <option value="customers">Customers Report</option>
                <option value="products">Products Report</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => generateReport('json')}
                disabled={loading}
                startIcon={<FileIcon className="w-4 h-4" />}
                className="flex-1"
              >
                {loading ? 'Generating...' : 'View Report'}
              </Button>
              <Button
                onClick={() => generateReport('csv')}
                disabled={loading}
                variant="outline"
                startIcon={<DownloadIcon className="w-4 h-4" />}
                className="flex-1"
              >
                {loading ? 'Exporting...' : 'Export CSV'}
              </Button>
            </div>
          </div>
        </div>

        {/* Report Preview */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Report Preview
          </h2>

          {reportData ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-2">
                  Summary
                </h3>
                <div className="space-y-2 text-sm">
                  {reportData.summary && (
                    <>
                      {reportData.summary.totalRevenue && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Revenue:</span>
                          <span className="font-semibold">
                            {new Intl.NumberFormat('en-LK', {
                              style: 'currency',
                              currency: 'LKR',
                            }).format(reportData.summary.totalRevenue)}
                          </span>
                        </div>
                      )}
                      {reportData.summary.totalOrders && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Orders:</span>
                          <span className="font-semibold">{reportData.summary.totalOrders}</span>
                        </div>
                      )}
                      {reportData.summary.totalCustomers && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Customers:</span>
                          <span className="font-semibold">{reportData.summary.totalCustomers}</span>
                        </div>
                      )}
                      {reportData.summary.totalProducts && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Products:</span>
                          <span className="font-semibold">{reportData.summary.totalProducts}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  {reportData.orders?.length || reportData.customers?.length || reportData.products?.length || 0} records
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Generate a report to see preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

