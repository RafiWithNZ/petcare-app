import express from "express";
import { getAll, add, del } from "../controllers/categoryController.js";
import { authenticate, restrict } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/",getAll);
router.post("/add",authenticate, restrict(["admin"]), add);
router.delete("/delete/:id",authenticate, restrict(["admin"]), del);

export default router;
