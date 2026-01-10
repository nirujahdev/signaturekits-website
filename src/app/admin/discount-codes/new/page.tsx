'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function NewDiscountCodePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    minimum_order_value: '',
    maximum_discount: '',
    usage_limit: '',
    user_limit: '',
    valid_from: '',
    valid_until: '',
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/discount-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create discount code');
      }

      toast.success('Discount code created successfully');
      router.push('/admin/discount-codes');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create discount code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New Discount Code</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Create a new discount code</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="code">Code *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
              placeholder="SUMMER20"
            />
          </div>

          <div>
            <Label htmlFor="discount_type">Discount Type *</Label>
            <Select
              value={formData.discount_type}
              onValueChange={(value: 'percentage' | 'fixed') => setFormData({ ...formData, discount_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="discount_value">Discount Value *</Label>
            <Input
              id="discount_value"
              type="number"
              step="0.01"
              value={formData.discount_value}
              onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
              required
              placeholder={formData.discount_type === 'percentage' ? '20' : '500'}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.discount_type === 'percentage' ? 'Percentage (e.g., 20 for 20%)' : 'Fixed amount in LKR'}
            </p>
          </div>

          {formData.discount_type === 'percentage' && (
            <div>
              <Label htmlFor="maximum_discount">Maximum Discount (LKR)</Label>
              <Input
                id="maximum_discount"
                type="number"
                step="0.01"
                value={formData.maximum_discount}
                onChange={(e) => setFormData({ ...formData, maximum_discount: e.target.value })}
                placeholder="1000"
              />
            </div>
          )}

          <div>
            <Label htmlFor="minimum_order_value">Minimum Order Value (LKR)</Label>
            <Input
              id="minimum_order_value"
              type="number"
              step="0.01"
              value={formData.minimum_order_value}
              onChange={(e) => setFormData({ ...formData, minimum_order_value: e.target.value })}
              placeholder="5000"
            />
          </div>

          <div>
            <Label htmlFor="usage_limit">Usage Limit</Label>
            <Input
              id="usage_limit"
              type="number"
              value={formData.usage_limit}
              onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
              placeholder="100"
            />
            <p className="text-xs text-gray-500 mt-1">Total times this code can be used (leave empty for unlimited)</p>
          </div>

          <div>
            <Label htmlFor="user_limit">User Limit</Label>
            <Input
              id="user_limit"
              type="number"
              value={formData.user_limit}
              onChange={(e) => setFormData({ ...formData, user_limit: e.target.value })}
              placeholder="1"
            />
            <p className="text-xs text-gray-500 mt-1">Times per customer (leave empty for unlimited)</p>
          </div>

          <div>
            <Label htmlFor="valid_from">Valid From *</Label>
            <Input
              id="valid_from"
              type="datetime-local"
              value={formData.valid_from}
              onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="valid_until">Valid Until *</Label>
            <Input
              id="valid_until"
              type="datetime-local"
              value={formData.valid_until}
              onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Summer sale discount code"
            rows={3}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="is_active">Active</Label>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Discount Code'
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

