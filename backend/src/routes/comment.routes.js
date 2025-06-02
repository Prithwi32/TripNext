import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
  addComment,
  deleteComment,
  getAllComments,
  replyToComment,
  updateComment,
} from "../controllers/comment.controller.js";

const router = Router();

//unsecure routes
router.route("/:blogId").get(getAllComments);

//secure routes
router.route("/add-comment/:blogId").post(isAuthenticated, addComment);
router
  .route("/reply-comment/:blogId/:parentCommentId")
  .post(isAuthenticated, replyToComment);
router
  .route("/update-comment/:commentId")
  .patch(isAuthenticated, updateComment);
router
  .route("/delete-comment/:commentId")
  .delete(isAuthenticated, deleteComment);

export default router;
