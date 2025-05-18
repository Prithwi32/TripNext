import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpiry: Date,
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
