'use client';

import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/admin/products/ProductForm';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create product');
      }

      toast.success('Product created successfully');
      router.push(`/admin/products/${result.product.id}`);
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.message || 'Failed to create product');
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Product</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Add a new product to your catalog
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

