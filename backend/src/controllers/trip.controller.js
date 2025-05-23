import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Trip } from "../models/trip.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import {Blog} from "../models/blog.models.js"
import { User } from "../models/user.models.js";

// get all Trips belonging to all users
const viewAllTrip = asyncHandler(async (req, res) => {
  const trips = await Trip.find({})
    .populate({
      path: "user",
      select: "userName userEmail"
    })
    .populate({
      path: "guide",
      select: "guideName contactNumber",
      options: { strictPopulate: false }
    })
    .populate({
      path: "blogId",
      select: "blogDescription createdAt",
      options: { strictPopulate: false }
    })
    .sort({ createdAt: -1 }); // Newest first

  if (!trips || trips.length === 0) {
    throw new ApiError(404, "No trips found");
  }

  return res.status(200).json({
    success: true,
    message: "Trips fetched successfully",
    data: trips,
  });
});


//get all Tips belonging to a particular user
const viewTrips = asyncHandler(async (req, res) => {
  const userEmail = req.user.email;
  const user = await User.findOne({ userEmail: userEmail });
  const userId = user._id;
  if (!userId) {
    throw new ApiError(400, "User ID is required to fetch trips");
  }
  //.populate("blogId", "blogDescription createdAt")
  const trips = await Trip.find({ user: userId })
    .populate("guide", "guideName contactNumber")
    .sort({ createdAt: -1 });

  if (!trips || trips.length === 0) {
    throw new ApiError(404, "No trips found for this user");
  }

  return res.status(200).json({
    success: true,
    message: "User's trips fetched successfully",
    data: trips,
  });
});


//create a trip for a particular user
const createTrip = asyncHandler(async (req, res) => {
  const userEmail = req.user.email;
  const user = await User.findOne({ userEmail: userEmail });
  const userId = user._id;

  const {
    tripLocation,
    tripDescription,
    hashtags = [],
    cost,
    guide = null,
    blogId = [],
  } = req.body;

  //validate required text fields
  if (
    [tripLocation, tripDescription].some(
      (field) => typeof field !== "string" || field.trim() === ""
    ) ||
    cost == null
  ) {
    throw new ApiError(
      400,
      "Trip location, description, and cost are required"
    );
  }

  //validate cost
  if (isNaN(cost) || Number(cost) < 0) {
    throw new ApiError(400, "Cost must be a non-negative number");
  }

  //validate & upload tripImages
  const imageFiles = req.files?.tripImages;
  if (!imageFiles || !Array.isArray(imageFiles) || imageFiles.length === 0) {
    throw new ApiError(400, "At least one trip image must be uploaded");
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
      throw new ApiError(500, "Failed to upload any trip images");
    }
  } catch (error) {
    console.log("Image upload failed", error);
    throw new ApiError(500, "Error uploading trip images");
  }

  try {
    const trip = await Trip.create({
      user: userId,
      guide: guide || null,
      tripLocation: tripLocation.trim(),
      tripDescription: tripDescription.trim(),
      tripImages: uploadedImages,
      hashtags: Array.isArray(hashtags) ? hashtags : [],
      cost: Number(cost),
      blogId: Array.isArray(blogId) ? blogId : [],
    });

    return res.status(201).json({
      success: true,
      message: "Trip created successfully",
      data: trip,
    });
  } catch (error) {
    console.log("Trip creation failed", error);

    //clean up images from cloudinary
    for (const url of uploadedImages) {
      const publicId = url.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    throw new ApiError(
      500,
      "Failed to create trip. Uploaded images were deleted."
    );
  }
});

//update the trip details belonging to a particular user
const updateTrip = asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  const userEmail = req.user.email;
  const user = await User.findOne({ userEmail: userEmail });
  const userId = user._id;
  console.log(userId, tripId)
  if (!tripId || !userId) {
    throw new ApiError(400, "Trip ID and User ID are required");
  }

  const trip = await Trip.findOne({ _id: tripId, user: userId });

  if (!trip) {
    throw new ApiError(404, "Trip not found or not authorized");
  }

  const {
    tripLocation,
    tripDescription,
    cost,
    hashtags,
    guide,
    blogId,
  } = req.body;

  if (tripLocation !== undefined) trip.tripLocation = tripLocation.trim();
  if (tripDescription !== undefined) trip.tripDescription = tripDescription.trim();
  if (cost !== undefined) {
    if (isNaN(cost) || Number(cost) < 0) {
      throw new ApiError(400, "Cost must be a valid non-negative number");
    }
    trip.cost = Number(cost);
  }
  if (Array.isArray(hashtags)) trip.hashtags = hashtags;
  if (guide !== undefined) trip.guide = guide;
  if (Array.isArray(blogId)) trip.blogId = blogId;

  await trip.save();

  return res.status(200).json({
    success: true,
    message: "Trip updated successfully",
    data: trip,
  });
});


//delete a trip belonging to a particular user
const deleteTrip = asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  const userEmail = req.user.email;
  const user = await User.findOne({ userEmail: userEmail });
  const userId = user._id;
  
  if (!tripId || !userId) {
    throw new ApiError(400, "Trip ID and User ID are required");
  }

  const trip = await Trip.findOne({ _id: tripId, user: userId });

  if (!trip) {
    throw new ApiError(404, "Trip not found or not authorized");
  }

  // Delete trip images from Cloudinary
  for (const url of trip.tripImages) {
    const publicId = url.split("/").pop().split(".")[0];
    await deleteFromCloudinary(publicId);
  }

  await Trip.deleteOne({ _id: tripId });

  return res.status(200).json({
    success: true,
    message: "Trip deleted successfully",
  });
});


export { viewAllTrip, viewTrips, createTrip, deleteTrip, updateTrip };
