import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Blog } from "../models/blog.models.js";
import { Trip } from "../models/trip.models.js";

//create a blog for user
const createBlog = asyncHandler(async (req, res) => {
  const userEmail = req.user.email;
  const user = await User.findOne({ userEmail: userEmail });
  const userId = user._id;

  const { trip, blogDescription, hashtags = [] } = req.body;

  if (
    !trip ||
    trip.trim() === "" ||
    !blogDescription ||
    blogDescription.trim() === ""
  ) {
    throw new ApiError(400, "TripId and blogDescription are required");
  }

  const tripDetails = await Trip.findById(trip);

  const imageFiles = req.files?.blogImages;
  console.log(imageFiles);
  if (!imageFiles || !Array.isArray(imageFiles) || imageFiles.length === 0) {
    throw new ApiError(400, "At least one blog image must be uploaded");
  }

  let uploadedImages = [];

  try {
    for (const file of imageFiles) {
      const cloudImage = await uploadOnCloudinary(file.path);
      if (cloudImage?.url) {
        uploadedImages.push(cloudImage.url);
      }
    }

    if (uploadedImages.length === 0) {
      throw new ApiError(500, "Failed to upload any blog images");
    }
  } catch (error) {
    console.log("Image upload failed", error);
    throw new ApiError(500, "Error uploading blog images");
  }

  try {
    const blog = await Blog.create({
      user: userId,
      trip: trip.trim(),
      blogDescription: blogDescription.trim(),
      blogImages: uploadedImages,
      blogComments: [],
      hashtags: Array.isArray(hashtags) ? hashtags : [],
    });
    tripDetails.blogId.push(blog._id);
    const updatedTripDetails = await Trip.findByIdAndUpdate(trip, tripDetails, {
      new: true,
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.log("Blog creation failed", error);

    //clean up images from cloudinary
    for (const url of uploadedImages) {
      const publicId = url.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    throw new ApiError(
      500,
      "Failed to create Blog. Uploaded images were deleted."
    );
  }
});

//update a blog by user
const updateBlog = asyncHandler(async (req, res) => {
  const userEmail = "prajwalbayari4@gmail.com";
  const user = await User.findOne({ userEmail: userEmail });
  const userId = user._id;
  const { id: blogId } = req.params;

  const blogDetails = await Blog.findById(blogId);

  if (blogDetails.user.toString() !== userId.toString()) {
    throw new ApiError(401, "UserId does not match");
  }

  const { blogDescription, hashtags = [] } = req.body;
  console.log(hashtags, typeof hashtags);

  if (!blogDescription || blogDescription.trim() === "") {
    throw new ApiError(400, "BlogDescription are required");
  }

  const imageFiles = req.files?.blogImages;
  if (!imageFiles || !Array.isArray(imageFiles) || imageFiles.length === 0) {
    throw new ApiError(400, "At least one blog image must be uploaded");
  }
  let oldImages = blogDetails.blogImages;
  let uploadedImages = [];

  try {
    for (const file of imageFiles) {
      const cloudImage = await uploadOnCloudinary(file.path);
      if (cloudImage?.url) {
        uploadedImages.push(cloudImage.url);
      }
    }

    if (uploadedImages.length === 0) {
      throw new ApiError(500, "Failed to upload any blog images");
    }
  } catch (error) {
    console.log("Image upload failed", error);
    throw new ApiError(500, "Error uploading blog images");
  }

  try {
    blogDetails.blogDescription = blogDescription;
    blogDetails.hashtags = Array.isArray(hashtags) ? hashtags : [hashtags];
    blogDetails.blogImages = uploadedImages;

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, blogDetails, {
      new: true,
    });

    console.log(blogDetails.hashtags);

    for (const url of oldImages) {
      const publicId = url.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    return res.status(200).json({
      success: true,
      message: "Blog Updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.log("Blog update failed", error);

    //clean up images from cloudinary
    for (const url of uploadedImages) {
      const publicId = url.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    throw new ApiError(
      500,
      "Failed to update Blog. Uploaded images were deleted."
    );
  }
});

//delete a blog by id and user
const deleteBlog = asyncHandler(async (req, res) => {});

//get only the user blogs
const getBlogs = asyncHandler(async (req, res) => {});

//get all blogs except for the blogs created by the requesting user
const getAllBlogs = asyncHandler(async (req, res) => {});

export { createBlog, updateBlog, deleteBlog, getAllBlogs, getBlogs };
