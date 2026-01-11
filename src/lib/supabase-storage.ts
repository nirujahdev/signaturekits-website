/**
 * Supabase Storage Utilities (Server-side only)
 * Functions for managing product images in Supabase Storage
 * DO NOT import this in client components - use supabase-storage-client.ts instead
 */

import { getAdminSupabaseClient } from './admin-supabase';

const BUCKET_NAME = 'product-images';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload product image to Supabase Storage
 */
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<UploadResult> {
  try {
    // Validate file
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'File size must be less than 5MB',
      };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'File must be JPEG, PNG, or WebP',
      };
    }

    const supabase = getAdminSupabaseClient();

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload image',
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload image',
    };
  }
}

/**
 * Delete product image from Supabase Storage
 */
export async function deleteProductImage(imageUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getAdminSupabaseClient();

    // Extract file path from URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/product-images/[path]
    const urlParts = imageUrl.split('/');
    const pathIndex = urlParts.indexOf('product-images');
    
    if (pathIndex === -1 || pathIndex === urlParts.length - 1) {
      return {
        success: false,
        error: 'Invalid image URL',
      };
    }

    const filePath = urlParts.slice(pathIndex + 1).join('/');

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Storage delete error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete image',
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete image',
    };
  }
}

/**
 * Get public URL for an image path
 */
export function getImageUrl(path: string): string {
  const supabase = getAdminSupabaseClient();
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);
  return data.publicUrl;
}

// validateImageFile has been moved to supabase-storage-client.ts for client-side use

