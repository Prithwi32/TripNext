import { asyncHandler } from "../utils/asyncHandler.js";
import { Guide } from "../models/guide.models.js";
import sendOTP from "../utils/sendEmail.js";
import { hash, compare } from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";

// SIGNUP GUIDE
const signupGuide = asyncHandler(async (req, res) => {
  const { guideName, guideEmail, password, contactNumber } = req.body;

  if ([guideName, guideEmail, password, contactNumber].some(field => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingGuide = await Guide.findOne({
    $or: [{ guideEmail }, { contactNumber }],
  });

  if (existingGuide) {
    throw new ApiError(400, "Guide with provided email or contact number already exists");
  }

  const hashedPassword = await hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await hash(otp, 10);
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  const guide = await Guide.create({
    guideName,
    guideEmail,
    password: hashedPassword,
    contactNumber,
    otp: hashedOtp,
    otpExpiry,
    isVerified: false,
  });

  await sendOTP(guideEmail, otp);

  res.status(201).json({ message: "OTP sent to your email" });
});

// VERIFY GUIDE
const verifyGuide = asyncHandler(async (req, res) => {
  const { guideEmail, otp } = req.body;

  if (!guideEmail || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const guide = await Guide.findOne({ guideEmail });

  if (!guide || !guide.otp || guide.otpExpiry < new Date()) {
    throw new ApiError(400, "OTP expired or invalid");
  }

  const isOtpValid = await compare(otp, guide.otp);
  if (!isOtpValid) {
    throw new ApiError(400, "Incorrect OTP");
  }

  guide.isVerified = true;
  guide.otp = undefined;
  guide.otpExpiry = undefined;
  await guide.save();

  res.status(200).json({ message: "Guide email verified successfully" });
});

// LOGIN GUIDE
const loginGuide = asyncHandler(async (req, res) => {
  const { guideEmail, password } = req.body;

  if (!guideEmail || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const guide = await Guide.findOne({ guideEmail });

  if (!guide) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!guide.isVerified) {
    throw new ApiError(403, "Please verify your email before logging in");
  }

  const isPasswordMatch = await compare(password, guide.password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Access denied: Incorrect password");
  }

  res.status(200).json({ message: "Login successful" });
});

// RESEND OTP
const resendOtpGuide = asyncHandler(async (req, res) => {
  const { guideEmail } = req.body;

  if (!guideEmail) {
    throw new ApiError(400, "Email is required");
  }

  const guide = await Guide.findOne({ guideEmail });

  if (!guide) {
    throw new ApiError(404, "Guide not found");
  }

  if (guide.isVerified) {
    throw new ApiError(400, "Guide is already verified");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await hash(otp, 10);
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  guide.otp = hashedOtp;
  guide.otpExpiry = otpExpiry;
  await guide.save();

  await sendOTP(guideEmail, otp);

  res.status(200).json({ message: "New OTP sent to guide's email" });
});

export {
  signupGuide,
  verifyGuide,
  loginGuide,
  resendOtpGuide
};
