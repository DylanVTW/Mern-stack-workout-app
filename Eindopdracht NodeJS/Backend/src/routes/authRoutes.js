import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  uploadProfileImage as uploadProfileImageController,
  getProfile,
} from "../controllers/authController.js";
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from "../middleware/validators.js";
import { requireAuth } from "../middleware/requireAuth.js";
import uploadProfileImage from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", validateRegister, handleValidationErrors, register);

router.post("/login", validateLogin, handleValidationErrors, login);

router.post("/refresh", refresh);

router.post("/logout", requireAuth, logout);

router.get("/profile", requireAuth, getProfile);

router.post(
  "/profile/image",
  requireAuth,
  uploadProfileImage.single("profileImage"),
  uploadProfileImageController,
);

export default router;
