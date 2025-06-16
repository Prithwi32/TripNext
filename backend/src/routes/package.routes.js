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
  .post(
    isAuthenticated,
    upload.fields([{ name: "packageImages", maxCount: 5 }]),
    createPackage
  );
// router.route("/update/:packageId").patch(isAuthenticated, updatePackage);
router.patch(
  "/update/:packageId",
  isAuthenticated,
  upload.fields([{ name: "packageImages", maxCount: 5 }]),
  updatePackage
);
router.route("/delete/:packageId").delete(isAuthenticated, deletePackage);

export default router;
