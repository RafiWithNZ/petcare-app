import express from "express";
import {
  getMyServices,
  getSingleServ,
  createServ,
  updateServ,
  deleteServ,
  updateServStatus,
} from "../controllers/serviceController.js";
import { authenticate, restrict } from "../middleware/verifyToken.js";

const router = express.Router({ mergeParams: true });

router.get("/", authenticate, restrict(["caretaker", "admin"]), getMyServices);
router.get(
  "/:id",
  authenticate,
  restrict(["caretaker", "admin"]),
  getSingleServ
);
router.post(
  "/create-service",
  authenticate,
  restrict(["caretaker", "admin"]),
  createServ
);
router.put("/:id", authenticate, restrict(["caretaker", "admin"]), updateServ);
router.delete(
  "/:id",
  authenticate,
  restrict(["caretaker", "admin"]),
  deleteServ
);
router.put("/status/:id", authenticate, restrict(["caretaker"]), updateServStatus);

export default router;
