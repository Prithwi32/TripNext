import { Router } from "express";
import {
  changeCurrentPassword,
  forgetPassword,
  getUserDetails,
  loginUser,
  resendOtp,
  resetPassword,
  signupUser,
  updateAccountDetails,
  verifyUser,
} from "../controllers/user.controller.js";
import {
  createTrip,
  deleteTrip,
  updateTrip,
  viewAllTrip,
  viewTrips,
} from "../controllers/trip.controller.js";
import { upload } from "../middleware/multer.middlewares.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

//unsecure routes
router.route("/signup").post(signupUser);
router.route("/verify").post(verifyUser);
router.route("/resend-otp").post(resendOtp);
router.route("/login").post(loginUser);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password").post(resetPassword);
router.route("/trip").get(viewAllTrip);

//secure routes

//trip related routes
router.route("/trip/:tripId").get(isAuthenticated, viewTrips);
router.route("/trip/update/:tripId").patch(isAuthenticated, updateTrip);
router.route("/trip/delete/:tripId").delete(isAuthenticated, deleteTrip);
router
  .route("/createTrip")
  .post(
    isAuthenticated,
    upload.fields([{ name: "tripImages", maxCount: 5 }]),
    createTrip
  );

//user related routes
router.route("/user").get(isAuthenticated, getUserDetails);
router.route("/change-password").post(changeCurrentPassword);
router.route("/update").patch(isAuthenticated, updateAccountDetails);


export default router;
