import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import sendOTP from "../utils/sendEmail.js";
import { hash, compare } from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";

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

  res.status(200).json({
    message: "Login successful",
    user: {
      name: user.userName,
      email: user.userEmail,
      role: "user",
    },
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

const forgetPassword = asyncHandler(async (req, res) => {});

//get all the detail of a user
const getUserDetails = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  const userDetails = await User.findById(_id);
  console.log(userDetails);
  if (!userDetails) {
    throw new ApiError(404, "No user found");
  }

  res.status(200).json({
    message: "Fetched user details successfully!",
    data: userDetails,
  });
});

//change the current password to a new password
const changeCurrentPassword = asyncHandler(async (req, res) => {});

//update about, username and email (if needed)
const updateAccountDetails = asyncHandler(async (req, res) => {
  const accountDetails = req.body;
  const userEmail = req.user.email;
  const details = await User.findOne({ userEmail: userEmail });
  if (
    !accountDetails.userName ||
    !accountDetails.profileImage ||
    !accountDetails.about
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const updatedDetails = await User.findByIdAndUpdate(
    details?._id,
    accountDetails,
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "User details updated successfully successfully",
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
  forgetPassword
};
