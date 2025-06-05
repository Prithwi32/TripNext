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
  let { locations, packageDescription = "", cost, guide, tripDays } = req.body;
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
  try {
    const { packageId } = req.params;
    let { locations, packageDescription, cost, tripDays, existingImages } =
      req.body;

    console.log("Raw request body:", req.body);
    console.log("Raw request files:", req.files);

    if (!packageId) {
      throw new ApiError(400, "Package ID is required");
    }

    const pkg = await Package.findById(packageId);
    if (!pkg) {
      throw new ApiError(404, "Package not found");
    }

    // Parse locations if it's a string
    try {
      locations =
        typeof locations === "string" ? JSON.parse(locations) : locations;
      console.log("Parsed locations:", locations);

      // Additional validation for locations
      if (!Array.isArray(locations)) {
        throw new Error("Locations must be an array");
      }

      // Filter out empty strings and trim values
      locations = locations
        .map((loc) => loc.trim())
        .filter((loc) => loc !== "");

      if (locations.length === 0) {
        throw new Error("At least one non-empty location is required");
      }
    } catch (err) {
      console.error("Error parsing locations:", err);
      throw new ApiError(400, err.message || "Invalid locations format");
    }

    // Parse existingImages if it's a string
    try {
      existingImages =
        typeof existingImages === "string"
          ? JSON.parse(existingImages)
          : existingImages;
      console.log("Parsed existingImages:", existingImages);

      if (existingImages && !Array.isArray(existingImages)) {
        throw new Error("Existing images must be an array");
      }
    } catch (err) {
      console.error("Error parsing existingImages:", err);
      existingImages = [];
    }

    // Update package fields
    pkg.locations = locations;

    if (packageDescription) {
      pkg.packageDescription = packageDescription.trim();
    }

    if (cost !== undefined) {
      const numCost = Number(cost);
      if (isNaN(numCost) || numCost < 0) {
        throw new ApiError(400, "Cost must be a valid non-negative number");
      }
      pkg.cost = numCost;
    }

    if (tripDays !== undefined) {
      const numTripDays = Number(tripDays);
      if (isNaN(numTripDays) || numTripDays < 1) {
        throw new ApiError(400, "Trip days must be at least 1");
      }
      pkg.tripDays = numTripDays;
    }

    // Handle images
    let newImages = [];
    // When using upload.fields, files are organized by field name
    const imageFiles = req.files?.packageImages || [];
    console.log("Raw files from multer:", req.files);
    console.log("Processing image files:", imageFiles);

    // Delete removed images from Cloudinary
    if (Array.isArray(existingImages)) {
      const imagesToDelete = pkg.images.filter(
        (img) => !existingImages.includes(img)
      );
      for (const url of imagesToDelete) {
        try {
          const publicId = url.split("/").pop().split(".")[0];
          await deleteFromCloudinary(publicId);
          console.log("Deleted image from Cloudinary:", publicId);
        } catch (err) {
          console.error("Error deleting image from Cloudinary:", err);
        }
      }
      // Update package images with remaining existing images
      pkg.images = existingImages;
    }

    // Upload new images if any
    if (imageFiles.length > 0) {
      console.log("Attempting to upload files:", imageFiles.length);
      for (const file of imageFiles) {
        try {
          if (!file.path) {
            console.error("File path is missing:", file);
            continue;
          }
          console.log("Uploading file:", {
            path: file.path,
            originalname: file.originalname,
            size: file.size,
          });
          const cloudImage = await uploadOnCloudinary(file.path);
          if (cloudImage?.url) {
            newImages.push(cloudImage.url);
            console.log("Successfully uploaded to Cloudinary:", cloudImage.url);
          } else {
            console.error(
              "Failed to upload image to Cloudinary:",
              file.originalname
            );
            throw new Error(`Failed to upload image: ${file.originalname}`);
          }
        } catch (err) {
          console.error("Error processing file:", file.originalname, err);
          throw new ApiError(500, `Error uploading image: ${err.message}`);
        }
      }

      if (newImages.length > 0) {
        // Add new images to package
        pkg.images = [...pkg.images, ...newImages];
        console.log("Updated package images:", pkg.images);
      }
    }

    // Validate total number of images
    if (pkg.images.length > 5) {
      throw new ApiError(400, "Maximum 5 images allowed");
    }

    if (pkg.images.length === 0) {
      throw new ApiError(400, "At least one image is required");
    }

    const savedPackage = await pkg.save();
    console.log("Updated package:", savedPackage);

    res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data: savedPackage,
    });
  } catch (err) {
    console.error("Package update error:", err);
    throw new ApiError(
      err.statusCode || 500,
      err.message || "Failed to update package"
    );
  }
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
