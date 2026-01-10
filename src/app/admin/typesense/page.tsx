'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Play } from 'lucide-react';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

interface SyncStatus {
  last_sync: string | null;
  last_success: string | null;
  last_failure: string | null;
  pending_count: number;
  failed_count: number;
}

interface SyncLog {
  id: string;
  sync_type: string;
  entity_id: string | null;
  status: string;
  action: string;
  error_message: string | null;
  synced_at: string | null;
  created_at: string;
}

export default function TypesensePage() {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchStatus();
    fetchLogs();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/admin/typesense/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/typesense/logs?limit=50');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleFullSync = async () => {
    if (!confirm('Are you sure you want to sync all products? This may take a while.')) {
      return;
    }

    setSyncing(true);
    try {
      const res = await fetch('/api/admin/typesense/sync-all', {
        method: 'POST',
      });

      if (res.ok) {
        toast.success('Full sync started');
        setTimeout(() => {
          fetchStatus();
          fetchLogs();
        }, 2000);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to start sync');
      }
    } catch (error) {
      toast.error('Failed to start sync');
    } finally {
      setSyncing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Typesense Sync</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor and manage Typesense search index synchronization
          </p>
        </div>
        <Button onClick={handleFullSync} disabled={syncing}>
          {syncing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Sync All Products
            </>
          )}
        </Button>
      </div>

      {/* Status Cards */}
      {status && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Last Sync</p>
            <p className="text-lg font-semibold">
              {status.last_sync ? new Date(status.last_sync).toLocaleString() : 'Never'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Last Success</p>
            <p className="text-lg font-semibold text-green-600">
              {status.last_success ? new Date(status.last_success).toLocaleString() : 'Never'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Last Failure</p>
            <p className="text-lg font-semibold text-red-600">
              {status.last_failure ? new Date(status.last_failure).toLocaleString() : 'Never'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            <p className="text-lg font-semibold text-yellow-600">{status.pending_count}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Failed (24h)</p>
            <p className="text-lg font-semibold text-red-600">{status.failed_count}</p>
          </div>
        </div>
      )}

      {/* Sync Logs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Sync Logs</h2>
          <Button variant="outline" size="sm" onClick={fetchLogs}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="text-left p-4 text-sm font-semibold">Type</th>
                <th className="text-left p-4 text-sm font-semibold">Entity ID</th>
                <th className="text-left p-4 text-sm font-semibold">Action</th>
                <th className="text-left p-4 text-sm font-semibold">Status</th>
                <th className="text-left p-4 text-sm font-semibold">Synced At</th>
                <th className="text-left p-4 text-sm font-semibold">Error</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="p-4">{log.sync_type}</td>
                  <td className="p-4 font-mono text-sm">{log.entity_id || '-'}</td>
                  <td className="p-4">{log.action}</td>
                  <td className="p-4">{getStatusBadge(log.status)}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {log.synced_at ? new Date(log.synced_at).toLocaleString() : '-'}
                  </td>
                  <td className="p-4 text-sm text-red-600">
                    {log.error_message || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No sync logs found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

