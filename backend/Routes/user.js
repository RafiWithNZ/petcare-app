import express from "express";
import {
  updateUsers,
  deleteUsers,
  getAllUsers,
  getSingleUser,
  getUserProfile,
  getMyOrders,
  toggleFavourite,
  favouriteStatus,
  updateUsersStatus, 
} from "../controllers/userController.js";

import { authenticate, restrict } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/:id", getSingleUser);
router.get("/", authenticate, restrict(["admin"]), getAllUsers);
router.put("/:id", authenticate, restrict(["customer", "admin"]), updateUsers);
router.delete(
  "/:id",
  authenticate,
  restrict(["customer", "admin"]),
  deleteUsers
);
router.get(
  "/user/profile",
  authenticate,
  restrict(["customer", "admin"]),
  getUserProfile
);
router.get(
  "/:id/my-orders",
  authenticate,
  restrict(["customer", "admin"]),
  getMyOrders
);

// Favourites
router.post("/:id/toggle-favourite", toggleFavourite);
router.get("/:userId/favourite-status/:caretakerId", favouriteStatus);

// Update user status
router.put("/status/:id", authenticate, restrict(["admin"]), updateUsersStatus); 

export default router;
