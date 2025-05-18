import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import setupCloudinary from "./src/utils/cloudinary.js";
import connectDB from "./src/db/index.js";
import userRouter from "./src/routes/userAuth.routes.js";
import guideRouter from "./src/routes/guideAuth.routes.js"

dotenv.config();

const app = express();

connectDB();
setupCloudinary();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// api/user/signup
// api/user/verify
// api/user/resend-verify
// api/user/login -> dashboard

// api/guide/signup
// api/guide/verify
// api/guide/resend-verify
// api/guide/login -> dashboard

// Use authRoutes as router middleware for /api
app.use("/api/user", userRouter);
app.use("/api/guide", guideRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
