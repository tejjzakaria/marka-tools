/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order, { generateOrderNumber } from '@/lib/models/Order';
import { appendToProductSheets } from '@/lib/googleSheets';

export const maxDuration = 30; // seconds — needed for Google Sheets API call

interface OrderItemInput {
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  selectedOffer?: {
    icon: string;
    text: string;
    price: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    const {
      customerName,
      customerPhone,
      customerAddress,
      items,
    } = body as {
      customerName: string;
      customerPhone: string;
      customerAddress: string;
      items: OrderItemInput[];
    };

    // Validate required fields
    if (!customerName || !customerPhone || !customerAddress || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate totals
    let subtotal = 0;
    let savings = 0;

    const orderItems = items.map((item) => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;

      // Only calculate savings if the price is actually lower than original price
      if (item.originalPrice && item.originalPrice > item.price) {
        savings += (item.originalPrice - item.price) * item.quantity;
      }

      return {
        productId: item.productId,
        productSlug: item.productSlug,
        productName: item.productName,
        productImage: item.productImage,
        price: item.price,
        originalPrice: item.originalPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        selectedOffer: item.selectedOffer,
      };
    });

    const total = subtotal;

    // Create order with generated order number
    const order = new Order({
      orderNumber: generateOrderNumber(),
      customerName,
      customerPhone,
      customerAddress,
      items: orderItems,
      subtotal,
      savings,
      total,
      status: 'pending',
      paymentMethod: 'cod',
    });

    await order.save();
    console.log(`[Orders API] Order saved to database: ${order.orderNumber}`);

    // Send to Google Sheets - route to product-specific sheets (BLOCKING - wait for completion)
    console.log(`[Orders API] Attempting to send order ${order.orderNumber} to Google Sheets...`);
    try {
      // Extract product IDs from order items
      const productIds = orderItems.map(item => item.productId);

      const sheetsResult = await appendToProductSheets(
        {
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerAddress: order.customerAddress,
          items: orderItems.map(item => ({
            productSlug: item.productSlug,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            selectedOffer: item.selectedOffer,
          })),
          createdAt: new Date().toISOString(),
        },
        productIds
      );

      if (sheetsResult.success) {
        console.log(`[Orders API] Order ${order.orderNumber} successfully sent to Google Sheets:`, {
          totalSheets: sheetsResult.results.length,
          successfulSheets: sheetsResult.results.filter(r => r.success).length,
          results: sheetsResult.results,
        });
      } else {
        console.warn(`[Orders API] Order ${order.orderNumber} failed to send to all sheets:`, {
          results: sheetsResult.results,
        });
      }
    } catch (error) {
      console.error(`[Orders API] CRITICAL: Failed to send order ${order.orderNumber} to Google Sheets:`, {
        errorName: error instanceof Error ? error.name : 'Unknown',
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined
      });
      // Don't fail the order creation if Google Sheets fails
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
