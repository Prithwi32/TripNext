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
    password: {
      type: String,
      required: true,
    },
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    previousTrips: [
      {
        type: Schema.Types.ObjectId,
        ref: "Trip",
      },
    ],
    profileImage: {
      type: String,
      default: "",
    },
    bookMarkList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Trip",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
