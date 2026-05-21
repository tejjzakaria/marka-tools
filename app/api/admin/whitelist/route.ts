/**
 * @author Zakaria Tejjani
 * @date 2026-05-22
 */

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import WhitelistedIp from '@/lib/models/WhitelistedIp';
import { verifyAdminAuth } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const authError = await verifyAdminAuth(request);
  if (authError) return authError;

  try {
    await connectToDatabase();
    const entries = await WhitelistedIp.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, entries });
  } catch (error) {
    console.error('Error fetching whitelist:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch whitelist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await verifyAdminAuth(request);
  if (authError) return authError;

  try {
    await connectToDatabase();
    const { ip, note } = await request.json();

    if (!ip || typeof ip !== 'string' || !ip.trim()) {
      return NextResponse.json({ success: false, message: 'IP address is required' }, { status: 400 });
    }

    const entry = await WhitelistedIp.findOneAndUpdate(
      { ip: ip.trim() },
      { ip: ip.trim(), note: note?.trim() || '' },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error('Error adding to whitelist:', error);
    return NextResponse.json({ success: false, message: 'Failed to add IP' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await verifyAdminAuth(request);
  if (authError) return authError;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip');

    if (!ip) {
      return NextResponse.json({ success: false, message: 'IP address is required' }, { status: 400 });
    }

    const deleted = await WhitelistedIp.findOneAndDelete({ ip });
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'IP not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from whitelist:', error);
    return NextResponse.json({ success: false, message: 'Failed to remove IP' }, { status: 500 });
  }
}
