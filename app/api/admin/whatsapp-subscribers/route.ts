/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import WhatsAppSubscriber from '@/lib/models/WhatsAppSubscriber';
import { verifyAdminAuth } from '@/lib/adminAuth';

// Get all WhatsApp subscribers
export async function GET(request: NextRequest) {
  try {
    const authError = await verifyAdminAuth(request);
    if (authError) return authError;

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build filter
    const filter: Record<string, unknown> = {};

    if (status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.phoneNumber = { $regex: search, $options: 'i' };
    }

    // Get subscribers and count
    const [subscribers, total] = await Promise.all([
      WhatsAppSubscriber.find(filter)
        .sort({ subscribedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      WhatsAppSubscriber.countDocuments(filter),
    ]);

    // Get stats
    const stats = await WhatsAppSubscriber.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statsMap = stats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
      stats: {
        total: statsMap.active + statsMap.unsubscribed || 0,
        active: statsMap.active || 0,
        unsubscribed: statsMap.unsubscribed || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching WhatsApp subscribers:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete subscriber
export async function DELETE(request: NextRequest) {
  try {
    const authError = await verifyAdminAuth(request);
    if (authError) return authError;

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Subscriber ID is required' },
        { status: 400 }
      );
    }

    const subscriber = await WhatsAppSubscriber.findByIdAndDelete(id);

    if (!subscriber) {
      return NextResponse.json(
        { success: false, message: 'Subscriber not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscriber deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
