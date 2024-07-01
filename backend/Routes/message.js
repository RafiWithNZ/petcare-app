import express from "express";
import {
  createMessage,
  getMessages,
} from "../controllers/messageController.js";
import { authenticate } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", authenticate, createMessage);
router.get("/:id", authenticate, getMessages);

export default router;
