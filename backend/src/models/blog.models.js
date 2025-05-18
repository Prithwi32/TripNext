import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    blogDescription: {
      type: String,
      required: true,
      trim: true,
    },
    blogImages: {
      type: [String],
      required: true,
      validate: {
        validator(arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: "At least one blog image is required.",
      },
    },
    blogComments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
      default: [],
    },
    hashtags: {
      type: [String],
      default: [],
      set: function (tags) {
        return tags.map((tag) => tag.toLowerCase().trim());
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Blog = mongoose.model("Blog", blogSchema);
