/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find all orders for this phone number
    const orders = await Order.find({ customerPhone: phone })
      .sort({ createdAt: -1 })
      .lean();

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { error: "No orders found for this phone number" },
        { status: 404 }
      );
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error tracking order:", error);
    return NextResponse.json(
      { error: "Failed to track order" },
      { status: 500 }
    );
  }
}
