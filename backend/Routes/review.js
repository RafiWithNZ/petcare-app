import express from "express";
import {
  getAllReviews,
  createReview,
} from "../controllers/reviewController.js";
import { authenticate, restrict } from "../middleware/verifyToken.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviews)
  .post(authenticate, restrict(["customer"]), createReview);

export default router;
