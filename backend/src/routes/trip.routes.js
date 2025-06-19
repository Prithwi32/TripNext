import { Router } from "express";
import {
  createTrip,
  deleteTrip,
  getTripById,
  updateTrip,
  viewTrip,
} from "../controllers/trip.controller.js";
import { upload } from "../middleware/multer.middlewares.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();



//secure routes:
router.route("/").get(isAuthenticated, viewTrip);
router.route("/:tripId").get(isAuthenticated, getTripById);
router.route("/update/:tripId").patch(isAuthenticated, updateTrip);
router.route("/delete/:tripId").delete(isAuthenticated, deleteTrip);
router
  .route("/create-trip")
  .post(
    isAuthenticated,
    upload.fields([{ name: "tripImages", maxCount: 5 }]),
    createTrip
  );

export default router;
