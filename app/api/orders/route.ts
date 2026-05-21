/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order, { generateOrderNumber } from '@/lib/models/Order';
import OrderAttempt from '@/lib/models/OrderAttempt';
import WhitelistedIp from '@/lib/models/WhitelistedIp';
import { appendToProductSheets } from '@/lib/googleSheets';

const ORDER_LIMIT_PER_PRODUCT = 2;

function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const allowedOrigin = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '');

  if (process.env.NODE_ENV === 'development') {
    const src = origin || referer || '';
    return src === '' || src.includes('localhost') || src.includes('127.0.0.1');
  }

  if (!allowedOrigin) return true; // env var not set — fail open

  if (origin) return origin === allowedOrigin;
  if (referer) return referer.startsWith(allowedOrigin);
  return false; // no origin/referer in production → block
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || '127.0.0.1';
}

async function lookupIpLocation(ip: string) {
  const isPrivate =
    ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === '::1';

  // In development, use a Moroccan test IP so the location UI is visible locally
  const lookupIp =
    isPrivate && process.env.NODE_ENV === 'development' ? '196.200.1.1' : ip;

  if (isPrivate && process.env.NODE_ENV !== 'development') return undefined;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(
      `http://ip-api.com/json/${lookupIp}?fields=status,city,regionName,country,countryCode`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    const data = await res.json();
    if (data.status !== 'success') return undefined;
    return {
      city: data.city || undefined,
      region: data.regionName || undefined,
      country: data.country || undefined,
      countryCode: data.countryCode || undefined,
    };
  } catch {
    return undefined;
  }
}

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

    // Block requests that don't originate from the storefront
    if (!isAllowedOrigin(request)) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!customerName || !customerPhone || !customerAddress || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // IP rate limiting: max 2 orders per product per IP within 12 hours
    const clientIp = getClientIp(request);
    const isWhitelisted = await WhitelistedIp.exists({ ip: clientIp });

    if (!isWhitelisted) {
      const windowStart = new Date(Date.now() - 12 * 60 * 60 * 1000);
      for (const item of items) {
        const count = await OrderAttempt.countDocuments({
          ip: clientIp,
          productId: item.productId,
          createdAt: { $gte: windowStart },
        });
        if (count >= ORDER_LIMIT_PER_PRODUCT) {
          return NextResponse.json(
            {
              success: false,
              message: `order_limit_reached`,
              productName: item.productName,
            },
            { status: 429 }
          );
        }
      }
    }

    // Fetch IP geolocation concurrently while we process the cart
    const locationPromise = lookupIpLocation(clientIp);

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

    const location = await locationPromise;

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
      ...(location && { location }),
    });

    await order.save();
    console.log(`[Orders API] Order saved to database: ${order.orderNumber}`);

    // Record IP attempts for each product (skip for whitelisted IPs)
    if (!isWhitelisted) {
      await OrderAttempt.insertMany(
        orderItems.map((item) => ({ ip: clientIp, productId: item.productId }))
      );
    }

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
