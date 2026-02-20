/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/lib/models/Product';

// Get all categories with product counts
export async function GET() {
  try {
    await connectToDatabase();

    // Get product counts per category
    const categoryCounts = await Product.aggregate([
      {
        $group: {
          _id: '$categoryId',
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert to map for easy lookup
    const countsMap = categoryCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      counts: countsMap,
    });
  } catch (error) {
    console.error('Error fetching category counts:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
