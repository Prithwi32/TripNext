import { Router } from "express";
import { loginGuide, resendOtpGuide, signupGuide, verifyGuide } from "../controllers/guide.controller.js";

const router = Router();

//unsecure routes
router.route("/signup").post(signupGuide);
router.route("/verify").post(verifyGuide);
router.route("/resend-otp").post(resendOtpGuide);
router.route("/login").post(loginGuide);

export default router;
