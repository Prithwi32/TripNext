import { Router } from "express";
import { getUserGallery } from "../controllers/gallery.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

// Get user gallery images
router.route("/").get(isAuthenticated, getUserGallery);

export default router;
