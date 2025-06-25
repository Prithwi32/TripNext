import { Router } from "express";
import {
  deleteMessage,
  getChatById,
  getUserChats,
  sendMessage,
  getGuideChats
} from "../controllers/chat.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

router.route("/sendMessage/:receiverId").post(isAuthenticated, sendMessage);
router.route("/getChat/:conversationId").get(isAuthenticated, getChatById);
router
  .route("/deleteMessage/:messageId")
  .delete(isAuthenticated, deleteMessage);
router.route("/getAllChats").get(isAuthenticated, getUserChats);
router.get("/guide/chats", isAuthenticated, getGuideChats);

export default router;
