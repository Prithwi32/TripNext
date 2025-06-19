import { Router } from "express";
import {
  changeCurrentPassword,
  forgetPassword,
  getUserDetails,
  getUserRecentActivity,
  loginUser,
  resendOtp,
  resetPassword,
  signupUser,
  updateAccountDetails,
  verifyUser,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

//unsecure routes:
router.route("/signup").post(signupUser);
router.route("/verify").post(verifyUser);
router.route("/resend-otp").post(resendOtp);
router.route("/login").post(loginUser);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password").post(resetPassword);

//secure routes:
router.route("/").get(isAuthenticated, getUserDetails);
router.route("/change-password").post(isAuthenticated, changeCurrentPassword);
router.route("/update").patch(isAuthenticated, updateAccountDetails);
router.route("/recent-activity").get(isAuthenticated, getUserRecentActivity);

export default router;
