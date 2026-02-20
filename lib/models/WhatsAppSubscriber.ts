/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import mongoose from 'mongoose';

const whatsappSubscriberSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'unsubscribed'],
      default: 'active',
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for phone number
whatsappSubscriberSchema.index({ phoneNumber: 1 });

const WhatsAppSubscriber =
  mongoose.models.WhatsAppSubscriber ||
  mongoose.model('WhatsAppSubscriber', whatsappSubscriberSchema);

export default WhatsAppSubscriber;
