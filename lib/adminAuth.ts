/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from './auth';

/**
 * Middleware to verify admin authentication via JWT token
 * Use this in all admin API routes
 */
export async function verifyAdminAuth(request: NextRequest): Promise<NextResponse | null> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  const payload = await verifyAdminToken(token);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized - Invalid or expired token' },
      { status: 401 }
    );
  }

  // Token is valid, return null to allow request to proceed
  return null;
}
