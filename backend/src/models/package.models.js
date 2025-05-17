import mongoose, { Schema } from "mongoose";

const packageSchema = new Schema(
  {
    locations: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one location is required.",
      },
    },
    packageDescription: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
      required: true,
    },
    tripDays: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const Package = mongoose.model("Package", packageSchema);
