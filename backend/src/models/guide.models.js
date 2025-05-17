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
    contactNumber: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^\+?[0-9]{10,15}$/.test(value);
        },
        message: (props) => `${props.value} is not a valid contact number!`,
      },
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
