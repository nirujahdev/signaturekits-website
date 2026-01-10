'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function EditDiscountCodePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    fetchCode();
  }, [id]);

  const fetchCode = async () => {
    try {
      const res = await fetch(`/api/admin/discount-codes/${id}`);
      if (res.ok) {
        const data = await res.json();
        const code = data.discount_code;
        setFormData({
          code: code.code,
          description: code.description || '',
          discount_type: code.discount_type,
          discount_value: code.discount_value.toString(),
          minimum_order_value: code.minimum_order_value?.toString() || '',
          maximum_discount: code.maximum_discount?.toString() || '',
          usage_limit: code.usage_limit?.toString() || '',
          user_limit: code.user_limit?.toString() || '',
          valid_from: new Date(code.valid_from).toISOString().slice(0, 16),
          valid_until: new Date(code.valid_until).toISOString().slice(0, 16),
          is_active: code.is_active,
        });
      }
    } catch (error) {
      toast.error('Failed to load discount code');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/discount-codes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update discount code');
      }

      toast.success('Discount code updated successfully');
      router.push('/admin/discount-codes');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update discount code');
    } finally {
      setSaving(false);
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Discount Code</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Update discount code details</p>
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
            />
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
            />
          </div>

          <div>
            <Label htmlFor="usage_limit">Usage Limit</Label>
            <Input
              id="usage_limit"
              type="number"
              value={formData.usage_limit}
              onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="user_limit">User Limit</Label>
            <Input
              id="user_limit"
              type="number"
              value={formData.user_limit}
              onChange={(e) => setFormData({ ...formData, user_limit: e.target.value })}
            />
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
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
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

