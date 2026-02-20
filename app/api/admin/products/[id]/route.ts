/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { verifyAdminAuth } from '@/lib/adminAuth';

// Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await verifyAdminAuth(request);
    if (authError) return authError;

    await connectToDatabase();
    const { id } = await params;

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update product
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await verifyAdminAuth(request);
    if (authError) return authError;

    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const {
      slug,
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      image,
      images,
      categoryId,
      badge,
      stockCount,
      sku,
      features,
      highlights,
      offers,
      guaranteeDays,
      rating,
      reviewCount,
      soldCount,
      viewersCount,
      reviews,
      googleSheetId,
    } = body;

    // Validate required fields
    if (!slug || !name || !description || !price || !categoryId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update product
    const product = await Product.findByIdAndUpdate(
      id,
      {
        slug,
        name,
        description,
        shortDescription,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        image,
        images: images || [],
        categoryId,
        badge: badge || undefined,
        rating: Number(rating) || 4.5,
        reviewCount: Number(reviewCount) || 0,
        inStock: stockCount > 0,
        sku: sku || undefined,
        stockCount: Number(stockCount) || 0,
        soldCount: Number(soldCount) || 0,
        viewersCount: Number(viewersCount) || 0,
        features: features || [],
        highlights: highlights || [],
        offers: offers || [],
        guaranteeDays: Number(guaranteeDays) || 30,
        reviews: reviews || [],
        googleSheetId: googleSheetId || undefined,
      },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: {
        id: product._id,
        slug: product.slug,
        name: product.name,
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
