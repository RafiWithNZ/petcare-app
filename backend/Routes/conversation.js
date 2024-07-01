import express from "express";
import {
  createConversation,
  getConversations,
  getSingleConversation,
  updateConversation,
  checkUnreadMessages,
} from "../controllers/conversationController.js";
import { authenticate } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/unread", authenticate, checkUnreadMessages);
router.get("/", authenticate, getConversations);
router.post("/", authenticate, createConversation);
router.get("/:id", authenticate, getSingleConversation);
router.put("/:id", authenticate, updateConversation);

export default router;
