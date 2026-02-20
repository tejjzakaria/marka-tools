/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import WhatsAppSubscriber from '@/lib/models/WhatsAppSubscriber';

// Subscribe to WhatsApp newsletter
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await WhatsAppSubscriber.findOne({ phoneNumber });

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { success: false, message: 'This number is already subscribed' },
          { status: 400 }
        );
      } else {
        // Reactivate unsubscribed number
        existing.status = 'active';
        existing.subscribedAt = new Date();
        await existing.save();
        return NextResponse.json({
          success: true,
          message: 'Successfully resubscribed',
        });
      }
    }

    // Create new subscriber
    const subscriber = await WhatsAppSubscriber.create({
      phoneNumber,
      status: 'active',
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed',
      subscriber: {
        id: subscriber._id,
        phoneNumber: subscriber.phoneNumber,
      },
    });
  } catch (error) {
    console.error('WhatsApp subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
