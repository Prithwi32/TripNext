import mongoose, { Schema } from "mongoose";

const packageSchema = new Schema(
  {
    location: {
      type: String,
      required: true,
      trim: true,
    },
    locationDescription: {
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
