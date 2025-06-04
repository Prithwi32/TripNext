import { Router } from "express";
import {
  deleteMessage,
  getChatById,
  getUserChats,
  sendMessage,
} from "../controllers/chat.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

router.route("/sendMessage/:recieverId").post(isAuthenticated, sendMessage);
router.route("/getChat/:recieverId").get(isAuthenticated, getChatById);
router
  .route("/deleteMessage/:messageId")
  .delete(isAuthenticated, deleteMessage);
router.route("/getAllChats").get(isAuthenticated, getUserChats);

export default router;
