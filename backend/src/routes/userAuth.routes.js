import { Router } from "express";
import {
  changeCurrentPassword,
  forgetPassword,
  getUserDetails,
  loginUser,
  resendOtp,
  signupUser,
  updateAccountDetails,
  verifyUser,
} from "../controllers/user.controller.js";
import { createTrip, deleteTrip, updateTrip, viewAllTrip, viewTrips } from "../controllers/trip.controller.js";
import { upload } from "../middleware/multer.middlewares.js";
import { isAuthenticated } from "../middleware/auth.js";
import { updateBlog } from "../controllers/blog.controller.js";

const router = Router();

//unsecure routes
router.route("/signup").post(signupUser);
router.route("/verify").post(verifyUser);
router.route("/resend-otp").post(resendOtp);
router.route("/login").post(loginUser);
router.route("/forget-password").post(forgetPassword);
router.route("/trip").get(viewAllTrip);

//secure routes

//trip related routes
router.route("/trip/:tripId").get(isAuthenticated, viewTrips);
router.route("/trip/update/:tripId").patch(isAuthenticated, updateTrip);
router.route("/trip/delete/:tripId").delete(isAuthenticated, deleteTrip);
router
  .route("/createTrip")
  .post(isAuthenticated, upload.fields([{ name: "tripImages", maxCount: 5 }]), createTrip);

//user related routes
router.route("/user").get(isAuthenticated, getUserDetails);
router.route("/changePassword").patch(isAuthenticated, changeCurrentPassword);
router.route("/update").patch(isAuthenticated, updateAccountDetails);

router.route("/updateBlog/:id").post(upload.fields([{ name: "blogImages", maxCount: 5 }]),updateBlog)

export default router;
