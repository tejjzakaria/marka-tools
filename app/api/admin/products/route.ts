/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { verifyAdminAuth } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authError = await verifyAdminAuth(request);
    if (authError) return authError;

    await connectToDatabase();

    // Get query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const badge = searchParams.get('badge');

    // Build query
    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'all') {
      query.categoryId = category;
    }

    if (badge && badge !== 'all') {
      query.badge = badge;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authError = await verifyAdminAuth(request);
    if (authError) return authError;

    await connectToDatabase();

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
    if (!slug || !name || !description || !shortDescription || !price || !image || !categoryId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Product with this slug already exists' },
        { status: 409 }
      );
    }

    const product = new Product({
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
    });

    await product.save();

    return NextResponse.json({
      success: true,
      product: {
        id: product._id,
        slug: product.slug,
        name: product.name,
      },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const authError = await verifyAdminAuth(request);
    if (authError) return authError;

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID required' },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
