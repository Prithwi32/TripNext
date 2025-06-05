import multer from "multer";
import fs from "fs";
import path from "path";

// Use absolute path and normalize it
const uploadDir = path.resolve(process.cwd(), "public", "temp");
console.log("Upload directory:", uploadDir);

// Ensure upload directory exists
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Created upload directory:", uploadDir);
  } else {
    console.log("Upload directory already exists");
  }
} catch (err) {
  console.error("Error creating upload directory:", err);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Double-check directory exists before saving
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a safe filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const safeName = uniqueSuffix + ext;
    console.log("Generated filename:", safeName);
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  console.log("Accepting file:", file.originalname);
  cb(null, true);
};

const uploadConfig = {
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
};

export const upload = multer(uploadConfig);
