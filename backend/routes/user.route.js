import express from "express";
import { updateProfile, deleteResume, getPublicProfile } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// protected routes
router.put("/profile", protect, updateProfile);
router.delete("/resume", protect, deleteResume);

//public route
router.get("/:id", getPublicProfile);

export default router;