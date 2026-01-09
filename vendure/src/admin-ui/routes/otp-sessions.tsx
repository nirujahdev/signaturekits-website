import React, { useState, useEffect } from 'react';
import { DataTable } from '../components/DataTable';

interface OTPSession {
  id: string;
  phone: string;
  sessionId: string;
  verified: boolean;
  attempts: number;
  expiresAt: string;
  createdAt: string;
}

const OTP_SESSIONS_QUERY = `
  query GetOTPSessions($options: OTPSessionListOptions) {
    supabaseOTPSessions(options: $options) {
      items {
        id
        phone
        sessionId
        verified
        attempts
        expiresAt
        createdAt
      }
      totalItems
    }
  }
`;

export const OTPSessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<OTPSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [take] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [phoneFilter, setPhoneFilter] = useState<string>('');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('');

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/admin-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: OTP_SESSIONS_QUERY,
          variables: {
            options: {
              skip,
              take,
              phone: phoneFilter || undefined,
              verified: verifiedFilter === '' ? undefined : verifiedFilter === 'true',
            },
          },
        }),
      });
      
      const result = await response.json();
      if (result.data?.supabaseOTPSessions) {
        setSessions(result.data.supabaseOTPSessions.items);
        setTotalItems(result.data.supabaseOTPSessions.totalItems);
      }
    } catch (error) {
      console.error('Failed to fetch OTP sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [skip, phoneFilter, verifiedFilter]);

  const columns = [
    { header: 'Phone', accessor: 'phone' as keyof OTPSession },
    { header: 'Session ID', accessor: 'sessionId' as keyof OTPSession },
    { 
      header: 'Verified', 
      accessor: (row: OTPSession) => (
        <span className={row.verified ? 'text-green-600' : 'text-red-600'}>
          {row.verified ? 'Yes' : 'No'}
        </span>
      )
    },
    { header: 'Attempts', accessor: 'attempts' as keyof OTPSession },
    { 
      header: 'Expires At', 
      accessor: (row: OTPSession) => {
        const expired = new Date(row.expiresAt) < new Date();
        return (
          <span className={expired ? 'text-red-600' : ''}>
            {new Date(row.expiresAt).toLocaleString()}
            {expired && ' (Expired)'}
          </span>
        );
      }
    },
    { 
      header: 'Created', 
      accessor: (row: OTPSession) => new Date(row.createdAt).toLocaleString() 
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">OTP Sessions</h1>
        
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Filter by phone number..."
            value={phoneFilter}
            onChange={(e) => {
              setPhoneFilter(e.target.value);
              setSkip(0);
            }}
            className="px-4 py-2 border rounded-lg flex-1 max-w-md"
          />

          <select
            value={verifiedFilter}
            onChange={(e) => {
              setVerifiedFilter(e.target.value);
              setSkip(0);
            }}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
        </div>
      </div>

      <DataTable data={sessions} columns={columns} loading={loading} />

      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {skip + 1} to {Math.min(skip + take, totalItems)} of {totalItems} sessions
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setSkip(Math.max(0, skip - take))}
            disabled={skip === 0}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setSkip(skip + take)}
            disabled={skip + take >= totalItems}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

