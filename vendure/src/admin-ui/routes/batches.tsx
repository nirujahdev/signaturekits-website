import React, { useState, useEffect } from 'react';
import { DataTable } from '../components/DataTable';

interface ImportBatch {
  id: string;
  batchNumber: string;
  status: string;
  orderCount: number;
  targetOrderCount: number;
  supplierOrderDate?: string;
  expectedArrivalDate?: string;
  actualArrivalDate?: string;
  dispatchedDate?: string;
  completedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface BatchAssignment {
  id: string;
  vendureOrderId: string;
  batchId: string;
  createdAt: string;
}

const BATCHES_QUERY = `
  query GetBatches {
    supabaseBatches {
      id
      batchNumber
      status
      orderCount
      targetOrderCount
      supplierOrderDate
      expectedArrivalDate
      actualArrivalDate
      dispatchedDate
      completedDate
      notes
      createdAt
      updatedAt
    }
  }
`;

const BATCH_ASSIGNMENTS_QUERY = `
  query GetBatchAssignments($batchId: ID!) {
    supabaseBatchAssignments(batchId: $batchId) {
      id
      vendureOrderId
      batchId
      createdAt
    }
  }
`;

export const BatchesPage: React.FC = () => {
  const [batches, setBatches] = useState<ImportBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<ImportBatch | null>(null);
  const [assignments, setAssignments] = useState<BatchAssignment[]>([]);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await fetch('/admin-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: BATCHES_QUERY,
        }),
      });
      
      const result = await response.json();
      if (result.data?.supabaseBatches) {
        setBatches(result.data.supabaseBatches);
      }
    } catch (error) {
      console.error('Failed to fetch batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async (batchId: string) => {
    try {
      const response = await fetch('/admin-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: BATCH_ASSIGNMENTS_QUERY,
          variables: { batchId },
        }),
      });
      
      const result = await response.json();
      if (result.data?.supabaseBatchAssignments) {
        setAssignments(result.data.supabaseBatchAssignments);
      }
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      fetchAssignments(selectedBatch.id);
    }
  }, [selectedBatch]);

  const columns = [
    { header: 'Batch Number', accessor: 'batchNumber' as keyof ImportBatch },
    { header: 'Status', accessor: 'status' as keyof ImportBatch },
    { 
      header: 'Progress', 
      accessor: (row: ImportBatch) => {
        const percentage = (row.orderCount / row.targetOrderCount) * 100;
        return `${row.orderCount} / ${row.targetOrderCount} (${percentage.toFixed(0)}%)`;
      }
    },
    { 
      header: 'Created', 
      accessor: (row: ImportBatch) => new Date(row.createdAt).toLocaleDateString() 
    },
  ];

  const assignmentColumns = [
    { header: 'Order ID', accessor: 'vendureOrderId' as keyof BatchAssignment },
    { 
      header: 'Assigned', 
      accessor: (row: BatchAssignment) => new Date(row.createdAt).toLocaleString() 
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Import Batches</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <DataTable
            data={batches}
            columns={columns}
            loading={loading}
            onRowClick={(batch) => setSelectedBatch(batch)}
          />
        </div>

        {selectedBatch && (
          <div className="bg-white p-4 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Batch {selectedBatch.batchNumber}</h2>
            
            <div className="space-y-3 mb-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium">{selectedBatch.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="font-medium">
                  {selectedBatch.orderCount} / {selectedBatch.targetOrderCount} orders
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(selectedBatch.orderCount / selectedBatch.targetOrderCount) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              {selectedBatch.supplierOrderDate && (
                <div>
                  <p className="text-sm text-gray-600">Supplier Order Date</p>
                  <p className="font-medium">
                    {new Date(selectedBatch.supplierOrderDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              {selectedBatch.expectedArrivalDate && (
                <div>
                  <p className="text-sm text-gray-600">Expected Arrival</p>
                  <p className="font-medium">
                    {new Date(selectedBatch.expectedArrivalDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              {selectedBatch.notes && (
                <div>
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="font-medium">{selectedBatch.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Order Assignments ({assignments.length})</h3>
              <DataTable data={assignments} columns={assignmentColumns} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

