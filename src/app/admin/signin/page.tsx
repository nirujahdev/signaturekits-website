'use client';

import AdminSignInForm from '@/components/admin/auth/AdminSignInForm';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AdminSignIn() {
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

