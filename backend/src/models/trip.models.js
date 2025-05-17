import mongoose, { Schema } from "mongoose";

const tripSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
      default: null,
    },
    tripLocation: {
      type: String,
      required: true,
      trim: true,
    },
    tripDescription: {
      type: String,
      required: true,
      trim: true,
    },
    tripImages: {
      type: [String],
      required: true,
      validate: {
        validator(arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: "At least one image of trip is required.",
      },
    },
    hashtags: {
      type: [String],
      default: [],
      set: function (tags) {
        return tags.map((tag) => tag.toLowerCase().trim());
      },
    },
    cost: {
      type: Number,
      required: true,
      min: [0, "Cost cannot be negative"],
    },
    blogId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Blog",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Trip = mongoose.model("Trip", tripSchema);
