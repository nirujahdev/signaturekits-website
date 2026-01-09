'use client';

import { useEffect, useState } from 'react';

export default function AdminRedirect() {
  const [vendureUrl, setVendureUrl] = useState<string | null>(null);

  useEffect(() => {
    // Get Vendure admin URL from environment variable
    // In production, this should be set in Vercel environment variables
    const adminUrl = process.env.NEXT_PUBLIC_VENDURE_ADMIN_URL;
    
    if (adminUrl) {
      setVendureUrl(adminUrl);
      // Redirect to Vendure admin dashboard
      window.location.href = adminUrl;
    } else {
      // Fallback: try to construct from API URL or show error
      const apiUrl = process.env.NEXT_PUBLIC_VENDURE_API_URL;
      if (apiUrl) {
        const constructedUrl = apiUrl.replace('/shop-api', '/admin');
        setVendureUrl(constructedUrl);
        window.location.href = constructedUrl;
      } else {
        setVendureUrl('http://localhost:3000/admin');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        {vendureUrl ? (
          <>
            <h1 className="text-2xl font-semibold mb-4">Redirecting to Admin Dashboard...</h1>
            <p className="text-gray-600 mb-4">Please wait while we redirect you to the Vendure admin panel.</p>
            <p className="text-sm text-gray-500">
              If you are not redirected automatically,{' '}
              <a href={vendureUrl} className="text-blue-600 hover:underline">
                click here
              </a>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold mb-4">Admin Dashboard Not Configured</h1>
            <p className="text-gray-600 mb-4">
              Please set the <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_VENDURE_ADMIN_URL</code> environment variable
              in your Vercel project settings.
            </p>
            <p className="text-sm text-gray-500">
              Example: <code className="bg-gray-100 px-2 py-1 rounded">https://your-vendure-server.com/admin</code>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

