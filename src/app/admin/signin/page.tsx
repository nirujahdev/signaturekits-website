'use client';

import AdminSignInForm from '@/components/admin/auth/AdminSignInForm';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AdminSignIn() {
  const { user, loading } = useAdminAuth();
  const router = useRouter();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  // If authenticated, don't render signin form (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-8">
        <div className="text-center text-white p-8">
          <h2 className="text-3xl font-bold mb-4">Signature Kits Admin</h2>
          <p className="text-lg opacity-90">
            Manage your jersey pre-order e-commerce platform
          </p>
        </div>
      </div>
      <AdminSignInForm />
    </div>
  );
}

