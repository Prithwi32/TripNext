import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

export default function setupCloudinary() {
  //configure cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("No file path provided");
      return null;
    }

    // Normalize the file path
    const normalizedPath = path.normalize(localFilePath);
    console.log("Attempting to upload file:", normalizedPath);

    // Check if file exists
    if (!fs.existsSync(normalizedPath)) {
      console.error("File does not exist:", normalizedPath);
      return null;
    }

    // Get file stats
    const stats = fs.statSync(normalizedPath);
    console.log("File stats:", {
      size: stats.size,
      isFile: stats.isFile(),
      path: normalizedPath,
    });

    // Upload to cloudinary
    const response = await cloudinary.uploader.upload(normalizedPath, {
      resource_type: "auto",
      folder: "travel-packages",
    });
    console.log("File uploaded to cloudinary. Response:", {
      url: response.url,
      public_id: response.public_id,
      format: response.format,
      size: response.bytes,
    });

    // Clean up the local file
    try {
      fs.unlinkSync(normalizedPath);
      console.log("Local file deleted:", normalizedPath);
    } catch (err) {
      console.error("Error deleting local file:", err);
    }

    return response;
  } catch (error) {
    console.error("Error in uploadOnCloudinary:", error);
    // Try to clean up the file even if upload failed
    try {
      if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log("Cleaned up local file after error");
      }
    } catch (err) {
      console.error("Error cleaning up file:", err);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      console.error("No public ID provided for deletion");
      return null;
    }
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted from cloudinary. Result:", result);
    return result;
  } catch (error) {
    console.error("Error deleting from cloudinary:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
