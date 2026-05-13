# SKU Feature Implementation

## Overview

Adds a SKU field to products, exposed in the add/edit product admin forms with an auto-generate button, and included as column K in the Google Sheets order sync.

---

## 1. Product Model

The `sku` field should already exist or needs to be added to `lib/models/Product.ts`:

```ts
sku: {
  type: String,
  trim: true,
  sparse: true,
  unique: true,
},
```

---

## 2. Google Sheets (`lib/googleSheets.ts`)

### 2a. Add `sku` to the `OrderItem` interface

```ts
interface OrderItem {
  productSlug: string;
  productName: string;
  price: number;
  quantity: number;
  sku?: string;           // ← add this
  selectedOffer?: {
    text: string;
    price: number;
  };
}
```

### 2b. Fetch `sku` from DB in `appendToProductSheets`

In the `Product.find()` call, add `sku: 1` to the projection:

```ts
const products = await Product.find(
  { _id: { $in: productIds } },
  { googleSheetId: 1, sku: 1 }   // ← add sku: 1
).lean();
```

### 2c. Build a productId → SKU map and enrich order items

Add this block right after the `products` fetch, before the `spreadsheetIds` loop:

```ts
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
```

Then replace every call to `appendToGoogleSheet(orderData, ...)` with `appendToGoogleSheet(enrichedOrderData, ...)`. There are two:
- The default-sheet fallback path
- Inside the `Promise.allSettled` map

### 2d. Add SKU as column K in the row array

In `appendToGoogleSheet`, update the row mapping to add two entries at the end — an empty column J (reserved) and SKU in column K:

```ts
return [
  orderData.orderNumber,   // A
  orderDate,               // B
  orderData.customerName,  // C
  orderData.customerPhone, // D
  orderData.customerAddress, // E
  variantPrice,            // F
  productVariant,          // G
  item.productName,        // H
  productUrl,              // I
  '',                      // J (empty — reserved)
  item.sku || '',          // K
];
```

Update the range string in both the log and the API call:

```ts
range: 'Youcan-Orders!A:K',
```

---

## 3. Admin Forms

Apply the same changes to both:
- `components/admin/AddProductForm.tsx`
- `app/admin/edit-product/[id]/EditProductForm.tsx`

### 3a. Add `IconRefresh` to Tabler icon imports

```ts
import {
  // ...existing icons
  IconRefresh,
} from '@tabler/icons-react';
```

### 3b. Add `generateSku` function

Place this near your other helper functions (e.g. next to `generateSlug`):

```ts
const generateSku = () => {
  const prefix = formData.name
    ? formData.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase()
    : 'PRD';
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  setFormData((prev) => ({ ...prev, sku: `${prefix}-${suffix}` }));
};
```

### 3c. Update the SKU field UI

Replace the plain `<input>` for SKU with a flex row that includes the generate button:

```tsx
<div>
  <label className="block text-sm font-medium text-neutral-700 mb-1">
    {t('sku')}
  </label>
  <div className="flex gap-2">
    <input
      type="text"
      name="sku"
      value={formData.sku}
      onChange={handleInputChange}
      className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      placeholder={t('skuPlaceholder')}
    />
    <button
      type="button"
      onClick={generateSku}
      title={t('generateSku')}
      className="px-3 py-2.5 border border-neutral-200 rounded-lg text-neutral-500 hover:text-primary hover:border-primary transition-colors"
    >
      <IconRefresh size={16} />
    </button>
  </div>
</div>
```

---

## 4. Translations

Add `generateSku` to both locale files.

**`messages/ar.json`** (primary — add alongside existing `sku`/`skuPlaceholder` keys):
```json
"generateSku": "توليد الرمز"
```

**`messages/en.json`**:
```json
"generateSku": "Generate SKU"
```

---

## 5. Vercel Function Timeout (orders route)

While not SKU-specific, also export `maxDuration` from `app/api/orders/route.ts` to prevent the Google Sheets call from being killed on Vercel:

```ts
export const maxDuration = 30;
```

---

## Google Sheets Column Layout Reference

| Col | Field |
|-----|-------|
| A | Order ID |
| B | Order Date |
| C | Customer Name |
| D | Phone |
| E | Address |
| F | Variant Price |
| G | Product Variant |
| H | Product Name |
| I | Product URL |
| J | *(empty — reserved)* |
| K | SKU |
