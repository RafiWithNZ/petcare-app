import express from "express";
import {
  getMyOrders,
  createOrder,
  accept,
  reject,
  complete,
  cancel,
  Rated,
} from "../controllers/orderController.js";

import { authenticate, restrict } from "../middleware/verifyToken.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  restrict(["caretaker", "customer", "admin"]),
  getMyOrders
);

router.post(
  "/create-order",
  authenticate,
  restrict(["customer", "admin"]),
  createOrder
);

// Order Status Routers
router.put(
  "/accept/:id",
  authenticate,
  restrict(["caretaker", "admin"]),
  accept
);

router.put(
  "/reject/:id",
  authenticate,
  restrict(["caretaker", "admin"]),
  reject
);

router.put(
  "/complete/:id",
  authenticate,
  restrict(["caretaker", "admin"]),
  complete
);

router.put(
  "/cancel/:id",
  authenticate,
  restrict(["customer", "admin"]),
  cancel
);

// Rated Order
router.put("/rated/:id", authenticate, restrict(["customer", "admin"]), Rated);

export default router;
