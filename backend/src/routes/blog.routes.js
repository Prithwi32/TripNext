import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getMyBlogs,
  updateBlog,
} from "../controllers/blog.controller.js";
import { isAuthenticated } from "../middleware/auth.js";
import { upload } from "../middleware/multer.middlewares.js";

const router = Router();

router.post(
  "/create",
  isAuthenticated,
  upload.fields([{ name: "blogImages", maxCount: 5 }]),
  createBlog
);

router.put(
  "/update/:id",
  isAuthenticated,
  upload.fields([{ name: "blogImages", maxCount: 5 }]),
  updateBlog
);

router.delete("/delete/:id", isAuthenticated, deleteBlog);
router.get("/my-blogs", isAuthenticated, getMyBlogs);
router.get("/", getAllBlogs);

export default router;
