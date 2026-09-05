/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductFeature {
  icon: string;
  title: string;
  description: string;
}

export interface IProductOffer {
  icon: string;
  text: string;
  price: number;
}

export interface IProductReview {
  reviewerName: string;
  reviewText: string;
  rating: number;
  date: string;
  verified: boolean;
  images?: string[];
}

export interface IProductAddonOption {
  label: string;
  price?: number;
}

export interface IProductAddon {
  id: string;
  title: string;
  icon?: string;
  price: number;
  options: IProductAddonOption[];
  multiple: boolean;
  maxPerOption: number;
  required: boolean;
}

export interface IProduct extends Document {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  categoryId: string;
  badge?: 'new' | 'sale' | 'bestseller';
  rating: number;
  reviewCount: number;
  inStock: boolean;
  sku?: string;
  stockCount: number;
  soldCount: number;
  viewersCount: number;
  features: IProductFeature[];
  highlights: string[];
  offers: IProductOffer[];
  addons: IProductAddon[];
  guaranteeDays: number;
  reviews: IProductReview[];
  googleSheetId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductFeatureSchema = new Schema<IProductFeature>(
  {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const ProductOfferSchema = new Schema<IProductOffer>(
  {
    icon: { type: String, required: true },
    text: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const ProductAddonOptionSchema = new Schema<IProductAddonOption>(
  {
    label: { type: String, required: true, trim: true },
    price: { type: Number, min: 0 },
  },
  { _id: false }
);

const ProductAddonSchema = new Schema<IProductAddon>(
  {
    id: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    options: { type: [ProductAddonOptionSchema], default: [] },
    multiple: { type: Boolean, default: true },
    maxPerOption: { type: Number, default: 10, min: 1 },
    required: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProductReviewSchema = new Schema<IProductReview>(
  {
    reviewerName: { type: String, required: true },
    reviewText: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    date: { type: String, required: true },
    verified: { type: Boolean, default: true },
    images: { type: [String], default: [] },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    categoryId: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      enum: ['new', 'sale', 'bestseller'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    sku: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    stockCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    viewersCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    features: {
      type: [ProductFeatureSchema],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    offers: {
      type: [ProductOfferSchema],
      default: [],
    },
    addons: {
      type: [ProductAddonSchema],
      default: [],
    },
    guaranteeDays: {
      type: Number,
      default: 30,
      min: 0,
    },
    reviews: {
      type: [ProductReviewSchema],
      default: [],
    },
    googleSheetId: {
      type: String,
      trim: true,
      sparse: true,
      validate: {
        validator: function(v: string) {
          // If empty/null, it's valid (optional field)
          if (!v) return true;
          // Validate Google Sheets ID format (44 characters alphanumeric with hyphens/underscores)
          return /^[a-zA-Z0-9-_]{44}$/.test(v);
        },
        message: 'Invalid Google Sheets Spreadsheet ID format'
      }
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for common queries
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ badge: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

// Delete the cached model to ensure schema updates are reflected
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
