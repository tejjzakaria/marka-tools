/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Contact from "@/lib/models/Contact";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create contact message
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      status: "new",
    });

    return NextResponse.json({
      success: true,
      message: "Contact message sent successfully",
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
      },
    });
  } catch (error) {
    console.error("Error creating contact message:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}
