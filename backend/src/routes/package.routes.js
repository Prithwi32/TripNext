import { Router } from "express";
import { upload } from "../middleware/multer.middlewares.js";
import { isAuthenticated } from "../middleware/auth.js";
import {
  createPackage,
  deletePackage,
  getAllPackage,
  getPackageById,
  updatePackage,
} from "../controllers/package.controller.js";

const router = Router();

//unsecure routes
router.route("/").get(getAllPackage);
router.route("/:packageId").get(getPackageById);

//secure routes
router
  .route("/create-package")
  .post(upload.fields([{ name: "packageImages", maxCount: 5 }]), createPackage);
router.route("/update/:packageId").patch(updatePackage);
router.route("/delete/:packageId").delete(deletePackage);

export default router;
