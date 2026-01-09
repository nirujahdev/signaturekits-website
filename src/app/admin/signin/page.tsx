import AdminSignInForm from '@/components/admin/auth/AdminSignInForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Sign In | Signature Kits',
  description: 'Admin dashboard sign in page',
};

export default function AdminSignIn() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="hidden lg:flex lg:w-1/2 bg-brand-500 items-center justify-center">
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

