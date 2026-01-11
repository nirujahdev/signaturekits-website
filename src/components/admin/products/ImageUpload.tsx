'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { X, Upload, Image as ImageIcon, GripVertical, ZoomIn, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateImageFile } from '@/lib/supabase-storage-client';
import { toast } from 'sonner';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  productId?: string;
  disabled?: boolean;
  maxImages?: number;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}

export function ImageUpload({
  images,
  onImagesChange,
  productId,
  disabled = false,
  maxImages = 10,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Map<string, UploadProgress>>(new Map());
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      
      // Check max images limit
      if (images.length + fileArray.length > maxImages) {
        setUploadError(`Maximum ${maxImages} images allowed. Please remove some images first.`);
        return;
      }

      setUploadError(null);
      setUploading(true);

      // Validate all files first
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      for (const file of fileArray) {
        const validation = validateImageFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file.name);
        }
      }

      if (invalidFiles.length > 0) {
        setUploadError(`Invalid files: ${invalidFiles.join(', ')}`);
        if (validFiles.length === 0) {
          setUploading(false);
          return;
        }
      }

      // Upload files
      const uploadPromises = validFiles.map(async (file) => {
        const fileId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        
        // Initialize progress
        setUploadProgress((prev) => {
          const newMap = new Map(prev);
          newMap.set(fileId, {
            file,
            progress: 0,
            status: 'uploading',
          });
          return newMap;
        });

        try {
          let imageUrl: string;

          if (productId) {
            // Upload to existing product
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`/api/admin/products/${productId}/images`, {
              method: 'POST',
              body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || 'Failed to upload image');
            }

            imageUrl = data.image;
          } else {
            // Temporary upload for new products
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/admin/products/temp-images', {
              method: 'POST',
              body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || 'Failed to upload image');
            }

            imageUrl = data.image;
          }

          // Update progress to success
          setUploadProgress((prev) => {
            const newMap = new Map(prev);
            const progress = newMap.get(fileId);
            if (progress) {
              newMap.set(fileId, {
                ...progress,
                progress: 100,
                status: 'success',
                url: imageUrl,
              });
            }
            return newMap;
          });

          // Add to images list
          onImagesChange([...images, imageUrl]);

          // Remove from progress after a delay
          setTimeout(() => {
            setUploadProgress((prev) => {
              const newMap = new Map(prev);
              newMap.delete(fileId);
              return newMap;
            });
          }, 2000);

          return imageUrl;
        } catch (error: any) {
          console.error('Upload error:', error);
          
          // Update progress to error
          setUploadProgress((prev) => {
            const newMap = new Map(prev);
            const progress = newMap.get(fileId);
            if (progress) {
              newMap.set(fileId, {
                ...progress,
                status: 'error',
                error: error.message || 'Failed to upload image',
              });
            }
            return newMap;
          });

          toast.error(`Failed to upload ${file.name}: ${error.message}`);
          throw error;
        }
      });

      try {
        await Promise.all(uploadPromises);
        toast.success(`Successfully uploaded ${validFiles.length} image(s)`);
      } catch (error) {
        // Errors are handled individually
      } finally {
        setUploading(false);
      }
    },
    [productId, images, onImagesChange, maxImages]
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
        toast.success('Image deleted successfully');
      } catch (error: any) {
        console.error('Delete error:', error);
        toast.error(error.message || 'Failed to delete image');
      }
    },
    [productId, images, onImagesChange]
  );

  const handleReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      const newImages = [...images];
      const [removed] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, removed);
      onImagesChange(newImages);
    },
    [images, onImagesChange]
  );

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newIndex = draggedIndex < index ? index : index;
    handleReorder(draggedIndex, newIndex);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDropZoneDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Product Images
        </label>
        <span className="text-xs text-gray-500">
          {images.length} / {maxImages} images
        </span>
      </div>

      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          onDragOver={handleDropZoneDragOver}
          onDragLeave={handleDropZoneDragLeave}
          onDrop={handleDropZoneDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragging
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
              : 'border-gray-300 dark:border-gray-700'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}`}
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={disabled || uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-brand-500 animate-spin mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Uploading images...</p>
            </div>
          ) : (
            <>
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {dragging ? 'Drop images here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                PNG, JPG, WEBP up to 5MB each. Multiple files supported.
              </p>
            </>
          )}
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress.size > 0 && (
        <div className="space-y-2">
          {Array.from(uploadProgress.entries()).map(([fileId, progress]) => (
            <div
              key={fileId}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              {progress.status === 'uploading' && (
                <Loader2 className="w-5 h-5 text-brand-500 animate-spin flex-shrink-0" />
              )}
              {progress.status === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              )}
              {progress.status === 'error' && (
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {progress.file.name}
                </p>
                {progress.status === 'uploading' && (
                  <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-brand-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                )}
                {progress.status === 'error' && progress.error && (
                  <p className="text-xs text-red-500 mt-1">{progress.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-200">{uploadError}</p>
          <button
            onClick={() => setUploadError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={`${imageUrl}-${index}`}
              draggable={!disabled}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group cursor-move ${draggedIndex === index ? 'opacity-50' : ''}`}
            >
              <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 group-hover:border-brand-500 transition-colors">
                <Image
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                
                {/* Drag Handle */}
                {!disabled && (
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-gray-600" />
                  </div>
                )}

                {/* Action Buttons */}
                {!disabled && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setPreviewImage(imageUrl)}
                      className="bg-white/90 backdrop-blur-sm rounded p-1.5 hover:bg-white transition-colors"
                      aria-label="Preview image"
                    >
                      <ZoomIn className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(imageUrl, index)}
                      className="bg-red-500 text-white rounded p-1.5 hover:bg-red-600 transition-colors"
                      aria-label="Delete image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Primary Badge */}
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-brand-500 text-white text-xs font-medium px-2 py-1 rounded">
                    Primary
                  </div>
                )}

                {/* Order Number */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded">
                  #{index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Message */}
      {!productId && images.length > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Images will be saved when you create the product.
        </p>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            onClick={() => setPreviewImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={previewImage}
              alt="Preview"
              width={1200}
              height={1200}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
