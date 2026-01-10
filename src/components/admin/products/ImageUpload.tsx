'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateImageFile } from '@/lib/supabase-storage';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  productId?: string;
  disabled?: boolean;
}

export function ImageUpload({
  images,
  onImagesChange,
  productId,
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      if (!productId) {
        setUploadError('Product ID is required for image upload');
        return;
      }

      setUploadError(null);
      setUploading(true);

      try {
        const file = files[0];
        const validation = validateImageFile(file);

        if (!validation.valid) {
          setUploadError(validation.error || 'Invalid file');
          setUploading(false);
          return;
        }

        // Create form data
        const formData = new FormData();
        formData.append('file', file);

        // Upload to API
        const response = await fetch(`/api/admin/products/${productId}/images`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload image');
        }

        // Add new image to list
        onImagesChange([...images, data.image]);
        setUploading(false);
      } catch (error: any) {
        console.error('Upload error:', error);
        setUploadError(error.message || 'Failed to upload image');
        setUploading(false);
      }
    },
    [productId, images, onImagesChange]
  );

  const handleDelete = useCallback(
    async (imageUrl: string, index: number) => {
      if (!productId) {
        // For new products, just remove from local state
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
        return;
      }

      try {
        const response = await fetch(`/api/admin/products/${productId}/images`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete image');
        }

        const data = await response.json();
        onImagesChange(data.product.images || []);
      } catch (error: any) {
        console.error('Delete error:', error);
        alert(error.message || 'Failed to delete image');
      }
    },
    [productId, images, onImagesChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Product Images
      </label>

      {/* Upload Area */}
      {(!productId || images.length === 0) && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-700'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={disabled}
          />
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {dragging ? 'Drop image here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            PNG, JPG, WEBP up to 5MB
          </p>
        </div>
      )}

      {/* Add More Images Button */}
      {productId && images.length > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : 'Add More Images'}
        </Button>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-800 dark:text-red-200">{uploadError}</p>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <Image
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleDelete(imageUrl, index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {index === 0 && (
                <p className="text-xs text-gray-500 mt-1 text-center">Primary</p>
              )}
            </div>
          ))}
        </div>
      )}

      {!productId && images.length > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Images will be uploaded when you save the product.
        </p>
      )}
    </div>
  );
}

