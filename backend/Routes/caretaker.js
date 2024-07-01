import express from "express";
import {
  updateCT,
  deleteCT,
  getAllCT,
  getSingleCT,
  getCTProfile,
  approval,
  updateCTStatus, // Tambahkan ini
} from "../controllers/caretakerController.js";

import { authenticate, restrict } from "../middleware/verifyToken.js";

import reviewRouter from "./review.js";

const router = express.Router();

// nested route
router.use("/:id/reviews", reviewRouter);

router.get("/:id", getSingleCT);
router.get("/", getAllCT);
router.put("/:id", authenticate, restrict(["caretaker", "admin"]), updateCT);
router.delete("/:id", authenticate, restrict(["caretaker", "admin"]), deleteCT);
router.get(
  "/caretaker/profile",
  authenticate,
  restrict(["caretaker", "admin"]),
  getCTProfile
);
router.put("/approval/:id", authenticate, restrict(["admin"]), approval);
router.put("/status/:id", authenticate, restrict(["admin"]), updateCTStatus);

export default router;
