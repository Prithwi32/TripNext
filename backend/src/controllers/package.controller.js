import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Package } from "../models/package.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// Get all packages belonging to a particular guide
const getPackage = asyncHandler(async (req, res) => {
  const guideId = req.params.guideId;

  if (!guideId) {
    throw new ApiError(400, "Guide ID is required");
  }

  const packages = await Package.find({ guide: guideId });

  if (!packages.length) {
    throw new ApiError(404, "No packages found for this guide");
  }

  res.status(200).json({
    success: true,
    message: "Packages fetched successfully",
    data: packages,
  });
});

// Get all packages of all guides
const getAllPackage = asyncHandler(async (req, res) => {
  const packages = await Package.find().sort({ createdAt: -1 });

  if (!packages.length) {
    throw new ApiError(404, "No packages found");
  }

  res.status(200).json({
    success: true,
    message: "All packages fetched successfully",
    data: packages,
  });
});

// Get the details of a single package based on packageId
const getPackageById = asyncHandler(async (req, res) => {
  const { packageId } = req.params;

  if (!packageId) {
    throw new ApiError(400, "Package ID is required");
  }

  const foundPackage = await Package.findById(packageId).populate("guide");

  if (!foundPackage) {
    throw new ApiError(404, "Package not found");
  }

  res.status(200).json({
    success: true,
    message: "Package fetched successfully",
    data: foundPackage,
  });
});

// Create a package for a particular guide
const createPackage = asyncHandler(async (req, res) => {
  let {
    locations,
    packageDescription = "",
    cost,
    guide,
    tripDays,
  } = req.body;
  if (typeof locations === "string") {
    try {
      const parsed = JSON.parse(locations);
      locations = Array.isArray(parsed) ? parsed : [parsed];
    } catch (err) {
      locations = [locations]; // treat raw string as single location
    }
  }

  if (
    !Array.isArray(locations) ||
    locations.length === 0 ||
    !guide ||
    !tripDays ||
    !cost
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  if (
    isNaN(cost) ||
    Number(cost) < 0 ||
    isNaN(tripDays) ||
    Number(tripDays) < 1
  ) {
    throw new ApiError(
      400,
      "Cost must be non-negative and tripDays at least 1"
    );
  }

  // Validate & Upload images
  const imageFiles = req.files?.packageImages;
  if (!imageFiles || !Array.isArray(imageFiles) || imageFiles.length === 0) {
    throw new ApiError(400, "At least one package image must be uploaded");
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
      throw new ApiError(500, "Failed to upload any package images");
    }
  } catch (err) {
    console.error("Image upload error:", err);
    throw new ApiError(500, "Error uploading package images");
  }

  try {
    const newPackage = await Package.create({
      locations,
      packageDescription,
      cost: Number(cost),
      guide,
      tripDays: Number(tripDays),
      images: uploadedImages,
    });

    res.status(201).json({
      success: true,
      message: "Package created successfully",
      data: newPackage,
    });
  } catch (error) {
    // Cleanup uploaded images on failure
    for (const url of uploadedImages) {
      const publicId = url.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    console.error("Package creation error:", error);
    throw new ApiError(
      500,
      "Package creation failed. Uploaded images were deleted."
    );
  }
});

// Update a package belonging to a guide
const updatePackage = asyncHandler(async (req, res) => {
  const { packageId } = req.params;
  const { locations, packageDescription, cost, tripDays } = req.body;

  if (!packageId) {
    throw new ApiError(400, "Package ID is required");
  }

  const pkg = await Package.findById(packageId);
  if (!pkg) {
    throw new ApiError(404, "Package not found");
  }

  if (locations !== undefined) {
    if (!Array.isArray(locations) || locations.length === 0) {
      throw new ApiError(400, "Locations must be a non-empty array");
    }
    pkg.locations = locations;
  }

  if (packageDescription !== undefined) {
    pkg.packageDescription = packageDescription;
  }

  if (cost !== undefined) {
    if (isNaN(cost) || Number(cost) < 0) {
      throw new ApiError(400, "Cost must be a valid non-negative number");
    }
    pkg.cost = Number(cost);
  }

  if (tripDays !== undefined) {
    if (isNaN(tripDays) || Number(tripDays) < 1) {
      throw new ApiError(400, "Trip days must be at least 1");
    }
    pkg.tripDays = Number(tripDays);
  }

  // Optional: Replace package images
  const imageFiles = req.files?.packageImages;
  if (Array.isArray(imageFiles) && imageFiles.length > 0) {
    for (const url of pkg.images) {
      const publicId = url.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    let newImages = [];
    for (const file of imageFiles) {
      const cloudImage = await uploadOnCloudinary(file.path);
      if (cloudImage?.url) {
        newImages.push(cloudImage.url);
      }
    }

    if (newImages.length > 0) {
      pkg.images = newImages;
    }
  }

  await pkg.save();

  res.status(200).json({
    success: true,
    message: "Package updated successfully",
    data: pkg,
  });
});

// Delete a package belonging to a guide
const deletePackage = asyncHandler(async (req, res) => {
  const { packageId } = req.params;

  if (!packageId) {
    throw new ApiError(400, "Package ID is required");
  }

  const pkg = await Package.findById(packageId);
  if (!pkg) {
    throw new ApiError(404, "Package not found");
  }

  try {
    await Package.deleteOne({ _id: packageId });

    for (const url of pkg.images) {
      const publicId = url.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    res.status(200).json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (err) {
    console.error("Delete package error:", err);
    throw new ApiError(500, "Failed to delete package");
  }
});

export {
  getAllPackage,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  getPackageById,
};
