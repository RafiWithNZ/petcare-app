import express from "express";
import {
  createPet,
  updatePet,
  deletePet,
  getMyPets,
  getPetProfile,
} from "../controllers/petController.js";

import { authenticate, restrict } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", authenticate, restrict(["customer", "admin"]), getMyPets);
router.get(
  "/:id",
  authenticate,
  restrict(["customer", "admin"]),
  getPetProfile
);

// CUD Routes
router.post(
  "/create-pet-info",
  authenticate,
  restrict(["customer", "admin"]),
  createPet
);
router.put("/:id", authenticate, restrict(["customer", "admin"]), updatePet);
router.delete("/:id", authenticate, restrict(["customer", "admin"]), deletePet);

export default router;
