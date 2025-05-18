import { Router } from "express";
import { loginUser, resendOtp, signupUser, verifyUser } from "../controllers/user.controller.js";

const router = Router();


// api/user/signup
// api/user/verify
// api/user/resend-verify
// api/user/login -> dashboard

//unsecure routes
router.route("/signup").post(signupUser);
router.route("/verify").post(verifyUser);
router.route("/resend-otp").post(resendOtp);
router.route("/login").post(loginUser);

export default router;
