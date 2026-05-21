/**
 * @author Zakaria Tejjani
 * @date 2026-05-22
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWhitelistedIp extends Document {
  ip: string;
  note?: string;
  createdAt: Date;
}

const WhitelistedIpSchema = new Schema<IWhitelistedIp>(
  {
    ip: { type: String, required: true, unique: true, trim: true },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);


const WhitelistedIp: Model<IWhitelistedIp> =
  mongoose.models.WhitelistedIp ||
  mongoose.model<IWhitelistedIp>('WhitelistedIp', WhitelistedIpSchema);

export default WhitelistedIp;
