import mongoose, { Schema } from "mongoose";

const guideSchema = new Schema(
  {
    guideName: {
      type: String,
      required: true,
      trim: true,
    },
    guideEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Guide = mongoose.model("Guide", guideSchema);
