/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

import { google } from 'googleapis';
import connectToDatabase from './mongodb';

interface OrderItemAddon {
  title: string;
  option?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

interface OrderItem {
  productSlug: string;
  productName: string;
  price: number;
  quantity: number;
  sku?: string;
  selectedOffer?: {
    text: string;
    price: number;
  };
  addons?: OrderItemAddon[];
}

/**
 * Human-readable one-cell summary of the add-ons selected for an order item (sheet column L).
 * e.g. "حبر الطابعة - أسود ×2 (518 MAD); حبر الطابعة - سماوي ×1 (259 MAD)"
 */
function formatAddons(addons?: OrderItemAddon[]): string {
  if (!addons || addons.length === 0) return '';
  return addons
    .map((a) => {
      const name = a.option ? `${a.title} - ${a.option}` : a.title;
      return `${name} ×${a.quantity} (${a.subtotal} MAD)`;
    })
    .join('; ');
}

interface OrderData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  createdAt: string;
}

export async function appendToGoogleSheet(
  orderData: OrderData,
  spreadsheetId?: string
): Promise<boolean> {
  try {
    console.log('[Google Sheets] Starting appendToGoogleSheet for order:', orderData.orderNumber);

    // Check if Google Sheets credentials are configured
    const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
    const defaultSpreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    // Use provided spreadsheetId or fall back to default
    const targetSpreadsheetId = spreadsheetId || defaultSpreadsheetId;

    console.log('[Google Sheets] Environment check:', {
      hasCredentials: !!credentials,
      credentialsLength: credentials?.length || 0,
      hasDefaultSpreadsheetId: !!defaultSpreadsheetId,
      usingCustomSheet: !!spreadsheetId,
      targetSpreadsheetId: targetSpreadsheetId || 'NOT SET'
    });

    if (!credentials || !targetSpreadsheetId) {
      console.error('[Google Sheets] CONFIGURATION ERROR: Missing environment variables', {
        GOOGLE_SHEETS_CREDENTIALS: credentials ? 'SET' : 'MISSING',
        spreadsheetId: targetSpreadsheetId || 'MISSING'
      });
      return false;
    }

    // Parse credentials
    console.log('[Google Sheets] Parsing credentials...');
    let parsedCredentials;
    try {
      parsedCredentials = JSON.parse(credentials);
      console.log('[Google Sheets] Credentials parsed successfully', {
        hasPrivateKey: !!parsedCredentials.private_key,
        clientEmail: parsedCredentials.client_email || 'MISSING',
        projectId: parsedCredentials.project_id || 'MISSING'
      });
    } catch (parseError) {
      console.error('[Google Sheets] JSON PARSE ERROR:', parseError);
      console.error('[Google Sheets] Credentials preview (first 100 chars):', credentials.substring(0, 100));
      throw new Error('Failed to parse GOOGLE_SHEETS_CREDENTIALS: ' + parseError);
    }

    // Create auth client
    console.log('[Google Sheets] Creating auth client...');
    const auth = new google.auth.GoogleAuth({
      credentials: parsedCredentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    console.log('[Google Sheets] Initializing Sheets API...');
    const sheets = google.sheets({ version: 'v4', auth });

    // Format date (from ISO string to readable format)
    const orderDate = new Date(orderData.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    // Base URL for products (change this to your actual domain)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amanaexpress.com';

    // Create one row per product item
    const rows = orderData.items.map((item) => {
      const variantPrice = item.price;
      const productVariant = item.selectedOffer ? item.selectedOffer.text : 'Regular';
      const productUrl = `${baseUrl}/product/${item.productSlug}`;

      return [
        orderData.orderNumber,        // A: Order ID
        item.sku || '',               // B: SKU
        orderDate,                    // C: Order date
        orderData.customerName,       // D: Customer name
        orderData.customerPhone,      // E: Phone
        orderData.customerAddress,    // F: City
        variantPrice,                 // G: Variant price
        productVariant,               // H: Product variant
        item.productName,             // I: Product name
        productUrl,                   // J: Product URL
        '',                           // K: (reserved — leave empty)
        formatAddons(item.addons),    // L: Add-ons
      ];
    });

    // Append all rows to sheet
    console.log('[Google Sheets] Appending to spreadsheet...', {
      spreadsheetId: targetSpreadsheetId,
      range: 'Youcan-Orders!A:L',
      rowCount: rows.length,
      orderNumber: orderData.orderNumber
    });

    // Add timeout wrapper to detect hanging requests
    const appendPromise = sheets.spreadsheets.values.append({
      spreadsheetId: targetSpreadsheetId,
      range: 'Youcan-Orders!A:L', // Columns A-L (12 columns total)
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows,
      },
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Google Sheets API timeout after 20 seconds')), 20000);
    });

    const appendResult = await Promise.race([appendPromise, timeoutPromise]) as any;

    console.log(`[Google Sheets] SUCCESS: Order ${orderData.orderNumber} appended to Google Sheets (${rows.length} items)`, {
      updatedRange: appendResult.data.updates?.updatedRange,
      updatedRows: appendResult.data.updates?.updatedRows,
      updatedColumns: appendResult.data.updates?.updatedColumns
    });
    return true;
  } catch (error) {
    console.error('[Google Sheets] ERROR: Failed to append to Google Sheets:', {
      orderNumber: orderData.orderNumber,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      // Log additional context for API errors
      errorDetails: (error as any)?.response?.data || (error as any)?.errors || 'No additional details'
    });
    return false;
  }
}

/**
 * Sends order to multiple Google Sheets based on product configurations
 * @param orderData Order data to send
 * @param productIds Array of product IDs in the order
 * @returns Object with success status and details of each attempt
 */
export async function appendToProductSheets(
  orderData: OrderData,
  productIds: string[]
): Promise<{
  success: boolean;
  results: Array<{
    spreadsheetId: string;
    success: boolean;
    error?: string;
  }>;
}> {
  try {
    console.log('[Google Sheets] Starting appendToProductSheets for order:', orderData.orderNumber, {
      productCount: productIds.length,
      productIds
    });

    // Import Product model dynamically to avoid circular dependencies
    const { default: Product } = await import('./models/Product');
    await connectToDatabase();

    // Fetch all products in the order
    const products = await Product.find(
      { _id: { $in: productIds } },
      { googleSheetId: 1, sku: 1 }
    ).lean();

    console.log('[Google Sheets] Fetched products:', {
      fetchedCount: products.length,
      products: products.map((p: any) => ({ id: p._id, sheetId: p.googleSheetId || 'none', sku: p.sku || 'none' }))
    });

    // Build productId → sku map and enrich order items
    const productSkuMap = new Map<string, string>();
    products.forEach((p: any) => {
      if (p.sku) productSkuMap.set(p._id.toString(), p.sku);
    });
    const enrichedOrderData = {
      ...orderData,
      items: orderData.items.map((item, i) => ({
        ...item,
        sku: productSkuMap.get(productIds[i]) || '',
      })),
    };

    // Collect unique spreadsheet IDs
    const spreadsheetIds = new Set<string>();

    products.forEach((product: any) => {
      if (product.googleSheetId) {
        spreadsheetIds.add(product.googleSheetId);
      }
    });

    console.log('[Google Sheets] Unique spreadsheet IDs found:', {
      count: spreadsheetIds.size,
      ids: Array.from(spreadsheetIds)
    });

    // If no custom sheets, use default
    if (spreadsheetIds.size === 0) {
      console.log('[Google Sheets] No custom sheets found, using default sheet');
      const defaultResult = await appendToGoogleSheet(enrichedOrderData);
      return {
        success: defaultResult,
        results: [{
          spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || 'default',
          success: defaultResult,
        }],
      };
    }

    // Send to all unique sheets
    console.log('[Google Sheets] Sending order to', spreadsheetIds.size, 'unique sheet(s)');
    const results = await Promise.allSettled(
      Array.from(spreadsheetIds).map(async (sheetId) => {
        console.log('[Google Sheets] Attempting to send to sheet:', sheetId);
        const success = await appendToGoogleSheet(enrichedOrderData, sheetId);
        return {
          spreadsheetId: sheetId,
          success,
        };
      })
    );

    // Process results
    const processedResults = results.map((result, index) => {
      const sheetId = Array.from(spreadsheetIds)[index];
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          spreadsheetId: sheetId,
          success: false,
          error: result.reason?.message || 'Unknown error',
        };
      }
    });

    // Overall success if at least one sheet succeeded
    const overallSuccess = processedResults.some((r) => r.success);

    console.log('[Google Sheets] appendToProductSheets completed:', {
      orderNumber: orderData.orderNumber,
      totalSheets: processedResults.length,
      successfulSheets: processedResults.filter(r => r.success).length,
      overallSuccess,
      results: processedResults
    });

    return {
      success: overallSuccess,
      results: processedResults,
    };
  } catch (error) {
    console.error('[Google Sheets] ERROR in appendToProductSheets:', {
      orderNumber: orderData.orderNumber,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined
    });
    return {
      success: false,
      results: [],
    };
  }
}
