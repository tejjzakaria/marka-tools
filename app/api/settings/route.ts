/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Setting from "@/lib/models/Setting";

export const dynamic = "force-dynamic";

// Public endpoint to get active tracking settings
export async function GET() {
  try {
    await connectToDatabase();

    const settings = await Setting.find({
      category: "tracking",
      isActive: true,
    })
      .select("key value")
      .lean();

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({
      success: true,
      settings: settingsMap,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
