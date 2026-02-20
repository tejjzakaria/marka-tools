/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyPin, generateAdminToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();

    if (!pin) {
      return NextResponse.json(
        { success: false, message: 'PIN is required' },
        { status: 400 }
      );
    }

    if (!process.env.ADMIN_PIN) {
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (verifyPin(pin)) {
      // Generate JWT token
      const token = await generateAdminToken();

      return NextResponse.json({
        success: true,
        token // Return token to client
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid PIN' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error in verify-pin:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
