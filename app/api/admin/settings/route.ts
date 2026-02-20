/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Setting from "@/lib/models/Setting";
import { verifyAdminAuth } from "@/lib/adminAuth";

// Get all settings
export async function GET(request: NextRequest) {
  try {
    const authError = await verifyAdminAuth(request);
    if (authError) return authError;

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const filter: Record<string, unknown> = {};
    if (category) {
      filter.category = category;
    }

    const settings = await Setting.find(filter).sort({ key: 1 }).lean();

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// Update or create setting
export async function POST(request: NextRequest) {
  try {
    const authError = await verifyAdminAuth(request);
    if (authError) return authError;

    await connectToDatabase();

    const body = await request.json();
    const { key, value, category, isActive } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const setting = await Setting.findOneAndUpdate(
      { key },
      { key, value, category, isActive },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      setting,
    });
  } catch (error) {
    console.error("Error saving setting:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save setting" },
      { status: 500 }
    );
  }
}

// Delete setting
export async function DELETE(request: NextRequest) {
  try {
    const authError = await verifyAdminAuth(request);
    if (authError) return authError;

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { success: false, message: "Setting key required" },
        { status: 400 }
      );
    }

    const setting = await Setting.findOneAndDelete({ key });

    if (!setting) {
      return NextResponse.json(
        { success: false, message: "Setting not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Setting deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting setting:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete setting" },
      { status: 500 }
    );
  }
}
