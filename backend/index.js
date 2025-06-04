import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import setupCloudinary from "./src/utils/cloudinary.js";
import connectDB from "./src/db/index.js";
import userRouter from "./src/routes/user.routes.js";
import guideRouter from "./src/routes/guide.routes.js";
import tripRouter from "./src/routes/trip.routes.js";
import packageRouter from "./src/routes/package.routes.js";
import commentRouter from "./src/routes/comment.routes.js";
import chatRouter from "./src/routes/chat.routes.js";

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

// endpoints of routes
app.use("/api/user", userRouter);
app.use("/api/guide", guideRouter);
app.use("/api/trip", tripRouter);
app.use("/api/package", packageRouter);
app.use("/api/comment", commentRouter);
app.use("/api/chat", chatRouter);


// global catch
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
