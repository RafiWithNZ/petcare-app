import express from "express";
import { register, login, activation, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/activation", activation);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
