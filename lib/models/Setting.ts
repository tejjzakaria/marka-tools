/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["tracking", "general", "seo"],
      default: "general",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Setting =
  mongoose.models.Setting || mongoose.model("Setting", settingSchema);

export default Setting;
