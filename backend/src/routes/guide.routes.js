import { Router } from "express";
import {
  changeCurrentPassword,
  forgetPassword,
  getAllGuides,
  getGuideDetails,
  loginGuide,
  resendOtpGuide,
  resetPassword,
  signupGuide,
  updateAccountDetails,
  verifyGuide,
} from "../controllers/guide.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

//unsecure routes
router.route("/signup").post(signupGuide);
router.route("/verify").post(verifyGuide);
router.route("/resend-otp").post(resendOtpGuide);
router.route("/login").post(loginGuide);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password").post(resetPassword);
router.route("/:id").get(getGuideDetails);
router.route("/").get(getAllGuides);

//secure routes:
router.route("/change-password").post(isAuthenticated, changeCurrentPassword);
router.route("/update").patch(isAuthenticated, updateAccountDetails);

//isAuthenticated,
// isAuthenticated,
// isAuthenticated,
export default router;
