import express from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middelware/auth.middleware.js";
import { roleMiddleware } from "../middelware/role.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

// Protected route
router.get("/me", authMiddleware, getCurrentUser);

// Admin only route example
router.get(
  "/admin/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  (req, res) => {
    console.log("✅ Admin route accessed by:", req.user);
    res.json({ message: "Admin access granted", user: req.user });
  },
);

// Manager and Admin route example
router.get(
  "/manager/dashboard",
  authMiddleware,
  roleMiddleware("MANAGER", "ADMIN"),
  (req, res) => {
    console.log("✅ Manager route accessed by:", req.user);
    res.json({ message: "Manager/Admin access granted", user: req.user });
  },
);

export default router;
