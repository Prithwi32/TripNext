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
  const userEmail = req.user.email;
  const user = await User.findOne({ userEmail: userEmail });
  const userId = user._id;
  const { id: blogId } = req.params;

  const blogDetails = await Blog.findById(blogId);

  if (blogDetails.user.toString() !== userId.toString()) {
    throw new ApiError(401, "UserId does not match. Unauthorized access!!");
  }

  const { blogDescription, hashtags = [] } = req.body;

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
const deleteBlog = asyncHandler(async (req, res) => {
  const userEmail = req.user.email;
  const user = await User.findOne({ userEmail: userEmail });
  const userId = user._id;
  const { id: blogId } = req.params;

  const blogDetails = await Blog.findById(blogId);

  if (blogDetails.user.toString() !== userId.toString()) {
    throw new ApiError(401, "UserId does not match. Unauthorized access!!");
  }
  const blogImages = blogDetails.blogImages;
  const tripDetails = await Trip.findById(blogDetails.trip);
  if (tripDetails) {
    tripDetails.blogId = tripDetails.blogId.filter(
      (id) => id.toString() !== blogId.toString()
    );
  }

  try {
    await Blog.findByIdAndDelete(blogId);
    if (tripDetails) {
      await Trip.findByIdAndUpdate(tripDetails._id, tripDetails);
    }
    for (const url of blogImages) {
      const publicId = url.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.log("Blog deletion failed", error);
    throw new ApiError(500, "Failed to delete Blog.");
  }
});

//get only the user blogs
const getMyBlogs = asyncHandler(async (req, res) => {
  const userEmail = req.user.email;
  const user = await User.findOne({ userEmail: userEmail });
  const userId = user._id;

  try {
    const myBlogs = await Blog.find({ user: userId });
    return res.status(200).json({
      success: true,
      message: "Fetched user's blogs",
      data: myBlogs,
    });
  } catch (error) {
    console.log("Can't fetch blogs", error);
    throw new ApiError(500, "Failed to fetch user's blogs.");
  }
});

//get all blogs except for the blogs created by the requesting user
const getAllBlogs = asyncHandler(async (req, res) => {
  const userEmail = req.user.email;
  const user = await User.findOne({ userEmail: userEmail });
  const userId = user._id;

  try {
    const allBlogs = await Blog.find({ user: { $ne: userId } });
    return res.status(200).json({
      success: true,
      message: "Fetched all blogs",
      data: allBlogs,
    });
  } catch (error) {
    console.log("Can't fetch blogs", error);
    throw new ApiError(500, "Failed to fetch all blogs.");
  }
});

export { createBlog, updateBlog, deleteBlog, getAllBlogs, getMyBlogs };
