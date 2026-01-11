import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export const dynamic = 'force-dynamic';

const BUCKET_NAME = 'product-images';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * POST /api/admin/products/temp-images
 * Upload temporary image for new products (before product is created)
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();

    // Get file from form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File must be JPEG, PNG, or WebP' },
        { status: 400 }
      );
    }

    // Generate unique filename for temporary upload
    const fileExt = file.name.split('.').pop();
    const fileName = `temp/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return NextResponse.json({
      image: urlData.publicUrl,
      path: fileName,
    });
  } catch (error: any) {
    console.error('Upload image error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/products/temp-images
 * Move temporary images to product folder after product creation
 */
export async function PUT(req: NextRequest) {
  try {
    const { productId, imageUrls } = await req.json();

    if (!productId || !imageUrls || !Array.isArray(imageUrls)) {
      return NextResponse.json(
        { error: 'Product ID and image URLs are required' },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabaseClient();
    const movedUrls: string[] = [];

    // Move each temporary image to product folder
    for (const imageUrl of imageUrls) {
      // Extract path from URL
      const urlParts = imageUrl.split('/');
      const pathIndex = urlParts.indexOf('product-images');
      
      if (pathIndex === -1 || pathIndex === urlParts.length - 1) {
        continue; // Skip invalid URLs
      }

      const oldPath = urlParts.slice(pathIndex + 1).join('/');
      
      // Only move if it's a temp file
      if (!oldPath.startsWith('temp/')) {
        movedUrls.push(imageUrl);
        continue;
      }

      // Generate new path in product folder
      const fileName = oldPath.split('/').pop();
      const newPath = `${productId}/${fileName}`;

      // Copy file to new location
      const { data: copyData, error: copyError } = await supabase.storage
        .from(BUCKET_NAME)
        .copy(oldPath, newPath);

      if (copyError) {
        console.error('Error copying file:', copyError);
        continue;
      }

      // Get new public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(newPath);

      movedUrls.push(urlData.publicUrl);

      // Delete old temp file
      await supabase.storage
        .from(BUCKET_NAME)
        .remove([oldPath]);
    }

    return NextResponse.json({
      images: movedUrls,
    });
  } catch (error: any) {
    console.error('Move images error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

