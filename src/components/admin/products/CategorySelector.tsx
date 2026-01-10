'use client';

import { useState, useEffect } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
}

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  disabled?: boolean;
}

export function CategorySelector({
  selectedCategories,
  onCategoriesChange,
  disabled = false,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/products/categories?is_active=true');
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCategory = (categoryName: string) => {
    if (disabled) return;

    const isSelected = selectedCategories.includes(categoryName);
    if (isSelected) {
      onCategoriesChange(selectedCategories.filter((c) => c !== categoryName));
    } else {
      onCategoriesChange([...selectedCategories, categoryName]);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    setAdding(true);
    try {
      const response = await fetch('/api/admin/products/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategoryName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create category');
      }

      // Add to categories list
      setCategories([...categories, data.category]);
      // Select the new category
      onCategoriesChange([...selectedCategories, data.category.name]);
      // Reset form
      setNewCategoryName('');
      setShowAddForm(false);
    } catch (error: any) {
      console.error('Error adding category:', error);
      alert(error.message || 'Failed to add category');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Categories</Label>
        <p className="text-sm text-gray-500">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Categories</Label>
        {!showAddForm && !disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New
          </Button>
        )}
      </div>

      {/* Add New Category Form */}
      {showAddForm && (
        <div className="flex gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            className="flex-1"
            disabled={adding}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleAddCategory}
            disabled={adding || !newCategoryName.trim()}
          >
            {adding ? 'Adding...' : 'Add'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setShowAddForm(false);
              setNewCategoryName('');
            }}
            disabled={adding}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Category Checkboxes */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.name);
          return (
            <label
              key={category.id}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggleCategory(category.name)}
                disabled={disabled}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm">{category.name}</span>
            </label>
          );
        })}
      </div>

      {selectedCategories.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'} selected
        </p>
      )}
    </div>
  );
}

