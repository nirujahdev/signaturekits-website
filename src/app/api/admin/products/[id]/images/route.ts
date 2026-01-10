import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';
import { uploadProductImage, deleteProductImage } from '@/lib/supabase-storage';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/products/[id]/images
 * Upload image to Supabase Storage and add to product
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();
    const { id } = params;

    // Check if product exists
    const { data: product } = await supabase
      .from('products')
      .select('id, images')
      .eq('id', id)
      .single();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get file from form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Upload image
    const uploadResult = await uploadProductImage(file, id);

    if (!uploadResult.success || !uploadResult.url) {
      return NextResponse.json(
        { error: uploadResult.error || 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Add image URL to product images array
    const currentImages = product.images || [];
    const updatedImages = [...currentImages, uploadResult.url];

    const { data, error } = await supabase
      .from('products')
      .update({ images: updatedImages, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product images:', error);
      return NextResponse.json(
        { error: 'Failed to update product images' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      image: uploadResult.url,
      product: data,
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
 * DELETE /api/admin/products/[id]/images
 * Delete image from storage and remove from product
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();
    const { id } = params;
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const { data: product } = await supabase
      .from('products')
      .select('id, images')
      .eq('id', id)
      .single();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete image from storage
    const deleteResult = await deleteProductImage(imageUrl);

    if (!deleteResult.success) {
      console.warn('Failed to delete image from storage:', deleteResult.error);
      // Continue to remove from product even if storage delete fails
    }

    // Remove image URL from product images array
    const currentImages = product.images || [];
    const updatedImages = currentImages.filter((url: string) => url !== imageUrl);

    const { data, error } = await supabase
      .from('products')
      .update({ images: updatedImages, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product images:', error);
      return NextResponse.json(
        { error: 'Failed to update product images' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Image deleted successfully',
      product: data,
    });
  } catch (error: any) {
    console.error('Delete image error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

