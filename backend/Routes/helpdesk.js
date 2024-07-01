import express from "express";
import {
  createSuggestion,
  getAllSuggestion,
} from "../controllers/helpdeskController.js";

import { authenticate, restrict } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", authenticate, restrict(["admin"]), getAllSuggestion);
router.post(
  "/create-suggestion",
  authenticate,
  restrict(["customer", "caretaker"]),
  createSuggestion
);

export default router;
