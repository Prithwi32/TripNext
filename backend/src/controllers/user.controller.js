import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import sendOTP from "../utils/sendEmail.js";
import { hash, compare } from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Signup Controller (Validates input, checks for existing user and generates and sends OTP)
const signupUser = asyncHandler(async (req, res) => {
  const { userName, userEmail, password } = req.body;

  if (
    [userName, userEmail, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { userEmail }],
  });

  if (existedUser) {
    throw new ApiError(400, "User with username or email already exists");
  }

  const hashedPassword = await hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await hash(otp, 10);
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  const user = await User.create({
    userName,
    userEmail,
    password: hashedPassword,
    otp: hashedOtp,
    otpExpiry,
    isVerified: false,
  });

  await sendOTP(userEmail, otp);

  res.status(201).json({ message: "OTP sent to your email" });
});

// OTP Verification Controller (Validates OTP and marks user as verified)
const verifyUser = asyncHandler(async (req, res) => {
  const { userEmail, otp } = req.body;

  if (!userEmail || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const user = await User.findOne({ userEmail });

  if (!user || !user.otp || user.otpExpiry < new Date()) {
    throw new ApiError(400, "OTP expired or invalid");
  }

  const isOtpValid = await compare(otp, user.otp);
  if (!isOtpValid) {
    throw new ApiError(400, "Incorrect OTP");
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.status(200).json({ message: "Email verified successfully" });
});

// Login Controller (Validates user credentials and checks if user is verified)
const loginUser = asyncHandler(async (req, res) => {
  const { userEmail, password } = req.body;

  if (!userEmail || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ userEmail });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email before logging in");
  }

  const isPasswordMatch = await compare(password, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Access denied: Incorrect password");
  }

  // Create JWT token
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.userEmail,
      role: "user",
    },
    process.env.NEXTAUTH_SECRET,
    { algorithm: "HS256", expiresIn: "24h" }
  );

  res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      profileImage: user.profileImage,
      name: user.userName,
      email: user.userEmail,
      role: "user",
    },
    token,
  });
});

//Resend OTP Controller (Regenerates OTP and sends it again)
const resendOtp = asyncHandler(async (req, res) => {
  const { userEmail } = req.body;

  if (!userEmail) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ userEmail });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "User is already verified");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await hash(otp, 10);
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  user.otp = hashedOtp;
  user.otpExpiry = otpExpiry;
  await user.save();

  await sendOTP(userEmail, otp);

  res.status(200).json({ message: "New OTP sent to your email" });
});

//lets user change the password in case they forget it
const forgetPassword = asyncHandler(async (req, res) => {
  const { userEmail } = req.body;

  if (!userEmail) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ userEmail });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await hash(otp, 10);
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  user.otp = hashedOtp;
  user.otpExpiry = otpExpiry;
  await user.save();

  await sendOTP(userEmail, otp);

  res.status(200).json({
    message: "OTP sent to your email for password reset",
  });
});

//reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { userEmail, otp, newPassword } = req.body;

  if (!userEmail || !otp || !newPassword) {
    throw new ApiError(400, "Email, OTP, and new password are required");
  }

  const user = await User.findOne({ userEmail });

  if (!user || !user.otp || user.otpExpiry < new Date()) {
    throw new ApiError(400, "OTP expired or invalid");
  }

  const isOtpValid = await compare(otp, user.otp);
  if (!isOtpValid) {
    throw new ApiError(400, "Incorrect OTP");
  }

  const hashedPassword = await hash(newPassword, 10);
  user.password = hashedPassword;
  user.otp = undefined;
  user.otpExpiry = undefined;
  user.isVerified = true; // Optional: ensure they are verified after this
  await user.save();

  res.status(200).json({
    message: "Password reset successfully",
  });
});

//get all the detail of a user
const getUserDetails = asyncHandler(async (req, res) => {
  const userEmail = req.user.email;
  const userDetails = await User.findOne(
    { userEmail },
    "-password -otp -otpExpiry -__v"
  );

  if (!userDetails) {
    throw new ApiError(404, "No user found");
  }

  res.status(200).json({
    message: "Fetched user details successfully!",
    data: userDetails,
  });
});

//change the current password to a new password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userEmail = req.user.email;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new passwords are required");
  }

  const user = await User.findOne({ userEmail });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await compare(oldPassword, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Old password is incorrect");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password must be different from old password");
  }

  const hashedNewPassword = await hash(newPassword, 10);
  user.password = hashedNewPassword;
  await user.save();

  res.status(200).json({
    message: "Password changed successfully",
  });
});

//update about, username and email (if needed)
const updateAccountDetails = asyncHandler(async (req, res) => {
  const accountDetails = req.body;
  const userEmail = req.user.email;

  const details = await User.findOne({ userEmail: userEmail });
  if (!details) {
    throw new ApiError(404, "User not found");
  }

  const allowedFields = ["userName", "profileImage", "about"];
  const updates = {};

  for (const field of allowedFields) {
    if (accountDetails[field] !== undefined) {
      updates[field] = accountDetails[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "At least one valid field is required to update");
  }

  const updatedDetails = await User.findByIdAndUpdate(details._id, updates, {
    new: true,
  });

  res.status(200).json({
    success: true,
    message: "User details updated successfully",
    data: updatedDetails,
  });
});

// Get user's recent activity and stats
const getUserRecentActivity = asyncHandler(async (req, res) => {
  const email = req.user.email;
  const user = await User.findOne({ userEmail: email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userId = user._id;

  // Get user trips count
  const tripCount = await mongoose.model("Trip").countDocuments({ user: userId });

  // Get user blogs count
  const blogCount = await mongoose.model("Blog").countDocuments({ user: userId });

  // Get user comments count
  const commentCount = await mongoose.model("Comment").countDocuments({ userId: userId });

  // Get recent trips
  const recentTrips = await mongoose.model("Trip")
    .find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(3)
    .select("tripLocation tripDescription createdAt tripImages")
    .lean();

  // Get recent blogs
  const recentBlogs = await mongoose.model("Blog")
    .find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(3)
    .select("blogDescription blogTitle createdAt blogImages hashtags")
    .lean();

  // Combine and format recent activity
  const recentActivity = [
    ...recentTrips.map(trip => ({
      type: 'trip',
      title: trip.tripDescription?.split('\n')[0]?.slice(0, 30) + (trip.tripDescription?.length > 30 ? '...' : '') || 'Trip',
      description: trip.tripLocation?.slice(0, 50) + (trip.tripLocation?.length > 50 ? '...' : '') || '',
      image: trip.tripImages?.[0] || '',
      createdAt: trip.createdAt,
      id: trip._id
    })), 
    ...recentBlogs.map(blog => ({
      type: 'blog',
      title: blog.blogTitle?.split('\n')[0]?.slice(0, 30) + (blog.blogTitle?.length > 30 ? '...' : '') || 'Blog post',
      description: blog.blogDescription?.slice(0, 50) + (blog.blogDescription?.length > 50 ? '...' : '') || '',
      image: blog.blogImages?.[0] || '',
      createdAt: blog.createdAt,
      id: blog._id
    }))
  ]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 5);

  // Return the data
  res.status(200).json({
    success: true,
    data: {
      stats: {
        tripCount,
        blogCount,
        commentCount,
      },
      recentActivity
    }
  });
});

export {
  signupUser,
  verifyUser,
  loginUser,
  resendOtp,
  getUserDetails,
  changeCurrentPassword,
  updateAccountDetails,
  forgetPassword,
  resetPassword,
  getUserRecentActivity
};
