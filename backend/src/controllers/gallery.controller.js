import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Blog } from "../models/blog.models.js";
import { Trip } from "../models/trip.models.js";
import { ApiError } from "../utils/ApiError.js";

// Get user gallery - combines images from blogs and trips
const getUserGallery = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find user to make sure they exist
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Get all blogs by user
  const blogs = await Blog.find({ user: userId })
    .select("blogTitle blogImages createdAt")
    .sort({ createdAt: -1 })
    .lean();

  // Get all trips by user
  const trips = await Trip.find({ user: userId })
    .select("tripLocation tripImages createdAt")
    .sort({ createdAt: -1 })
    .lean();

  // Extract and format images from blogs
  const blogImages = blogs.flatMap((blog) =>
    blog.blogImages.map((image) => ({
      id: `${blog._id}-${blog.blogImages.indexOf(image)}`,
      imageUrl: image,
      source: "blog",
      sourceId: blog._id,
      title: blog.blogTitle,
      createdAt: blog.createdAt,
    }))
  );

  // Extract and format images from trips
  const tripImages = trips.flatMap((trip) =>
    trip.tripImages.map((image) => ({
      id: `${trip._id}-${trip.tripImages.indexOf(image)}`,
      imageUrl: image,
      source: "trip",
      sourceId: trip._id,
      title: trip.tripLocation,
      createdAt: trip.createdAt,
    }))
  );

  // Combine all images and sort by creation date (newest first)
  const allImages = [...blogImages, ...tripImages].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.status(200).json({
    success: true,
    message: "Gallery images retrieved successfully",
    data: {
      totalImages: allImages.length,
      images: allImages,
    },
  });
});

export { getUserGallery };
