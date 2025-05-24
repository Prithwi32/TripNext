import { Router } from "express";
import { getGuideDetails, loginGuide, resendOtpGuide, signupGuide, verifyGuide } from "../controllers/guide.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

//unsecure routes
router.route("/signup").post(signupGuide);
router.route("/verify").post(verifyGuide);
router.route("/resend-otp").post(resendOtpGuide);
router.route("/login").post(loginGuide);
router.route("/forget-password").post();
router.route("/reset-password").post();

//secure routes:
router.route("/").get(isAuthenticated, getGuideDetails);
router.route("/change-password").post(isAuthenticated, changeCurrentPassword);
router.route("/update").patch(isAuthenticated, updateAccountDetails);

export default router;
