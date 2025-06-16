import { asyncHandler } from "../utils/asyncHandler.js";
import { Guide } from "../models/guide.models.js";
import sendOTP from "../utils/sendEmail.js";
import { hash, compare } from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";
import { Package } from "../models/package.models.js";

// signup guide
const signupGuide = asyncHandler(async (req, res) => {
  const { guideName, guideEmail, password, contactNumber } = req.body;

  if (
    [guideName, guideEmail, password, contactNumber].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingGuide = await Guide.findOne({
    $or: [{ guideEmail }, { contactNumber }],
  });

  if (existingGuide) {
    throw new ApiError(
      400,
      "Guide with provided email or contact number already exists"
    );
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

//verify guide
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

//login guide
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

  res.status(200).json({
    message: "Login successful",
    user: {
      id: guide._id,
      name: guide.guideName,
      email: guide.guideEmail,
      profileImage:guide.profileImage,
      role: "guide",
    },
  });
});

//resend otp
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

//get all guides
const getAllGuides = asyncHandler(async (req, res) => {
  const guides = await Guide.find({}, "-password -otp -otpExpiry -__v");

  if (!guides || guides.length === 0) {
    throw new ApiError(404, "No guides found");
  }

  res.status(200).json({
    success: true,
    message: "All guides fetched successfully",
    data: guides,
  });
});

//get all the details of a single guide
const getGuideDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const guideDetails = await Guide.findById(id, "-password -otp -otpExpiry -__v");
  const packageDetails = await Package.find({ guide: id });
  
  if (!guideDetails) {
    throw new ApiError(404, "No user found");
  }

  res.status(200).json({
    message: "Fetched Guide details successfully!",
    data: { guide: guideDetails, package: packageDetails },
  });
});

// update guide profile
const updateAccountDetails = asyncHandler(async (req, res) => {
  const accountDetails = req.body;
  const guideEmail = req.user.email;

  const details = await Guide.findOne({ guideEmail: guideEmail });

  if (!details) {
    throw new ApiError(404, "Guide not found");
  }

  const allowedFields = ["guideName", "contactNumber", "description", "profileImage"];
  const updates = {};

  for (const field of allowedFields) {
    if (accountDetails[field] !== undefined) {
      updates[field] = accountDetails[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "At least one valid field is required to update");
  }

  const updatedDetails = await Guide.findByIdAndUpdate(details._id, updates, { new: true });

  res.status(200).json({
    success: true,
    message: "Guide details updated successfully",
    data: updatedDetails,
  });
});

// change current password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const guideEmail = req.user?.email;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new passwords are required");
  }

  const guide = await Guide.findOne({ guideEmail });

  if (!guide) {
    throw new ApiError(404, "Guide not found");
  }

  const isPasswordValid = await compare(oldPassword, guide.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Old password is incorrect");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password must be different from old password");
  }

  const hashedPassword = await hash(newPassword, 10);
  guide.password = hashedPassword;
  await guide.save();

  res.status(200).json({ message: "Password changed successfully" });
});

// forget password
const forgetPassword = asyncHandler(async (req, res) => {
  const { guideEmail } = req.body;

  if (!guideEmail) {
    throw new ApiError(400, "Email is required");
  }

  const guide = await Guide.findOne({ guideEmail });

  if (!guide) {
    throw new ApiError(404, "Guide not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await hash(otp, 10);
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  guide.otp = hashedOtp;
  guide.otpExpiry = otpExpiry;
  await guide.save();

  await sendOTP(guideEmail, otp);

  res
    .status(200)
    .json({ message: "OTP sent to guide's email for password reset" });
});

// reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { guideEmail, otp, newPassword } = req.body;

  if (!guideEmail || !otp || !newPassword) {
    throw new ApiError(400, "Email, OTP and new password are required");
  }

  const guide = await Guide.findOne({ guideEmail });

  if (!guide || !guide.otp || guide.otpExpiry < new Date()) {
    throw new ApiError(400, "OTP expired or invalid");
  }

  const isOtpValid = await compare(otp, guide.otp);
  if (!isOtpValid) {
    throw new ApiError(400, "Incorrect OTP");
  }

  const hashedPassword = await hash(newPassword, 10);
  guide.password = hashedPassword;
  guide.otp = undefined;
  guide.otpExpiry = undefined;

  await guide.save();

  res.status(200).json({ message: "Password reset successfully" });
});

export {
  signupGuide,
  verifyGuide,
  loginGuide,
  resendOtpGuide,
  updateAccountDetails,
  changeCurrentPassword,
  getGuideDetails,
  forgetPassword,
  resetPassword,
  getAllGuides,
};
