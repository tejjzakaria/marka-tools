/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItemAddon {
  addonId: string;
  title: string;
  option?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface IOrderItem {
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  subtotal: number;
  selectedOffer?: {
    icon: string;
    text: string;
    price: number;
  };
  addons?: IOrderItemAddon[];
}

export interface IOrderLocation {
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: IOrderItem[];
  subtotal: number;
  savings: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  notes?: string;
  location?: IOrderLocation;
  customerIp?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemAddonSchema = new Schema<IOrderItemAddon>(
  {
    addonId: { type: String, required: true },
    title: { type: String, required: true },
    option: { type: String },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    productSlug: { type: String, required: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
    selectedOffer: {
      type: {
        icon: { type: String, required: true },
        text: { type: String, required: true },
        price: { type: Number, required: true },
      },
      required: false,
    },
    addons: {
      type: [OrderItemAddonSchema],
      default: undefined,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    customerAddress: {
      type: String,
      required: true,
      trim: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: function(v: IOrderItem[]) {
          return v.length > 0;
        },
        message: 'Order must have at least one item',
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    savings: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: 'cod', // Cash on Delivery
    },
    notes: {
      type: String,
      trim: true,
    },
    location: {
      type: {
        city: { type: String },
        region: { type: String },
        country: { type: String },
        countryCode: { type: String },
      },
      required: false,
    },
    customerIp: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customerPhone: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

// Helper function to generate order number
export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `AE${year}${month}${day}${random}`;
}

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
