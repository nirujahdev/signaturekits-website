'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface DiagnosticResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  details?: any;
}

export default function DiagnosticsPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);

  const runDiagnostics = async () => {
    setRunning(true);
    const diagnosticResults: DiagnosticResult[] = [];

    // Test 1: Check Public Products API
    try {
      const response = await fetch('/api/products?limit=100');
      const data = await response.json();
      
      if (response.ok && data.products?.items) {
        diagnosticResults.push({
          name: 'Public Products API',
          status: 'pass',
          message: `✅ API accessible - ${data.products.totalItems} total products`,
          details: {
            totalItems: data.products.totalItems,
            itemsReturned: data.products.items.length,
            firstProduct: data.products.items[0]?.name || 'N/A',
          },
        });

        // Check for AC Milan specifically
        const acMilan = data.products.items.find((p: any) =>
          p.name?.toUpperCase().includes('AC MILAN') || 
          p.name?.toUpperCase().includes('KAKA')
        );

        if (acMilan) {
          diagnosticResults.push({
            name: 'AC Milan Product in API',
            status: 'pass',
            message: `✅ Found: ${acMilan.name}`,
            details: acMilan,
          });
        } else {
          diagnosticResults.push({
            name: 'AC Milan Product in API',
            status: 'fail',
            message: '❌ AC Milan product NOT found in public API response',
            details: {
              note: 'Product exists in admin but not visible to public',
              possibleCauses: [
                'Product is marked as inactive (is_active = false)',
                'RLS policy blocking public access',
                'Product not in database',
              ],
            },
          });
        }
      } else {
        diagnosticResults.push({
          name: 'Public Products API',
          status: 'fail',
          message: `❌ API error: ${response.status} ${response.statusText}`,
          details: data,
        });
      }
    } catch (error: any) {
      diagnosticResults.push({
        name: 'Public Products API',
        status: 'fail',
        message: `❌ Network error: ${error.message}`,
        details: error,
      });
    }

    // Test 2: Check Admin Products API
    try {
      const response = await fetch('/api/admin/products?limit=100');
      const data = await response.json();

      if (response.ok && data.products) {
        diagnosticResults.push({
          name: 'Admin Products API',
          status: 'pass',
          message: `✅ Admin API accessible - ${data.pagination?.total || data.products.length} total products`,
          details: {
            total: data.pagination?.total,
            firstProduct: data.products[0]?.title || 'N/A',
          },
        });

        // Check for AC Milan in admin
        const acMilan = data.products.find((p: any) =>
          p.title?.toUpperCase().includes('AC MILAN') || 
          p.title?.toUpperCase().includes('KAKA')
        );

        if (acMilan) {
          diagnosticResults.push({
            name: 'AC Milan Product in Admin',
            status: acMilan.is_active ? 'pass' : 'warning',
            message: acMilan.is_active
              ? `✅ Found: ${acMilan.title} (Active)`
              : `⚠️  Found: ${acMilan.title} (INACTIVE - this is why it's not showing!)`,
            details: {
              id: acMilan.id,
              title: acMilan.title,
              slug: acMilan.slug,
              is_active: acMilan.is_active,
              is_featured: acMilan.is_featured,
              price: acMilan.price,
              currency: acMilan.currency_code,
              images: acMilan.images?.length || 0,
              sizes: acMilan.sizes || [],
              categories: acMilan.categories || [],
              tags: acMilan.tags || [],
            },
          });
        } else {
          diagnosticResults.push({
            name: 'AC Milan Product in Admin',
            status: 'fail',
            message: '❌ AC Milan product NOT found in admin API',
            details: null,
          });
        }
      } else {
        diagnosticResults.push({
          name: 'Admin Products API',
          status: 'fail',
          message: `❌ Admin API error: ${response.status} ${response.statusText}`,
          details: data,
        });
      }
    } catch (error: any) {
      diagnosticResults.push({
        name: 'Admin Products API',
        status: 'fail',
        message: `❌ Network error: ${error.message}`,
        details: error,
      });
    }

    // Test 3: Check if public and admin product counts match
    const publicTest = diagnosticResults.find((r) => r.name === 'Public Products API');
    const adminTest = diagnosticResults.find((r) => r.name === 'Admin Products API');

    if (publicTest?.status === 'pass' && adminTest?.status === 'pass') {
      const publicCount = publicTest.details?.totalItems || 0;
      const adminCount = adminTest.details?.total || 0;

      if (publicCount === 0 && adminCount > 0) {
        diagnosticResults.push({
          name: 'Data Visibility',
          status: 'fail',
          message: `❌ Admin has ${adminCount} products, but public API shows 0`,
          details: {
            issue: 'Row Level Security (RLS) policy likely blocking public access',
            solution: 'Check Supabase RLS policies on products table',
          },
        });
      } else if (publicCount < adminCount) {
        diagnosticResults.push({
          name: 'Data Visibility',
          status: 'warning',
          message: `⚠️  Some products not visible: Admin ${adminCount}, Public ${publicCount}`,
          details: {
            difference: adminCount - publicCount,
            possibleCause: 'Some products are marked as inactive',
          },
        });
      } else {
        diagnosticResults.push({
          name: 'Data Visibility',
          status: 'pass',
          message: '✅ Product counts match between admin and public',
          details: {
            count: publicCount,
          },
        });
      }
    }

    // Test 4: Test Collection Filtering
    try {
      const collectionResponse = await fetch('/api/products?collection=retro&limit=50');
      const collectionData = await collectionResponse.json();

      if (collectionResponse.ok) {
        diagnosticResults.push({
          name: 'Collection Filtering (Retro)',
          status: 'pass',
          message: `✅ Collection filter working - ${collectionData.products?.totalItems || 0} retro products`,
          details: collectionData.products?.items?.slice(0, 3).map((p: any) => p.name),
        });
      } else {
        diagnosticResults.push({
          name: 'Collection Filtering (Retro)',
          status: 'fail',
          message: '❌ Collection filtering failed',
          details: collectionData,
        });
      }
    } catch (error: any) {
      diagnosticResults.push({
        name: 'Collection Filtering (Retro)',
        status: 'fail',
        message: `❌ Error: ${error.message}`,
        details: error,
      });
    }

    setResults(diagnosticResults);
    setRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return 'border-green-200 bg-green-50 dark:bg-green-900/10';
      case 'fail':
        return 'border-red-200 bg-red-50 dark:bg-red-900/10';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10';
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-900/10';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          System Diagnostics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Check backend connections and product visibility
        </p>
      </div>

      <Card className="p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Run Full Diagnostics
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tests database connectivity, API routes, and product visibility
            </p>
          </div>
          <Button onClick={runDiagnostics} disabled={running} size="lg">
            {running ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              'Run Diagnostics'
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3 mt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Results
            </h3>
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getStatusIcon(result.status)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {result.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">
                      {result.message}
                    </p>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 dark:text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                          Show details
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-64">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && !running && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Click "Run Diagnostics" to start testing
          </div>
        )}
      </Card>

      <Card className="p-6 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Common Issues & Solutions
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>
            <strong>Product inactive:</strong> Go to Products → Edit product → Check
            "Active" checkbox
          </li>
          <li>
            <strong>RLS blocking public access:</strong> Check Supabase RLS policies on
            products table
          </li>
          <li>
            <strong>Missing categories/tags:</strong> Add categories and tags to product
            for collection filtering
          </li>
          <li>
            <strong>No images:</strong> Upload at least one product image
          </li>
        </ul>
      </Card>
    </div>
  );
}

