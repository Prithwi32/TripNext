import { Router } from "express";
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

//unsecure routes:
router.route("/trip").get(viewAllTrip);

//secure routes:
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

export default router;
