/**
 * @author Zakaria Tejjani
 * @date 2026-05-22
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderAttempt extends Document {
  ip: string;
  productId: string;
  createdAt: Date;
}

const OrderAttemptSchema = new Schema<IOrderAttempt>(
  {
    ip: { type: String, required: true },
    productId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// TTL index: auto-delete documents after 12 hours (43200 seconds)
OrderAttemptSchema.index({ createdAt: 1 }, { expireAfterSeconds: 43200 });
// Compound index for fast per-IP per-product lookups
OrderAttemptSchema.index({ ip: 1, productId: 1 });

const OrderAttempt: Model<IOrderAttempt> =
  mongoose.models.OrderAttempt ||
  mongoose.model<IOrderAttempt>('OrderAttempt', OrderAttemptSchema);

export default OrderAttempt;
