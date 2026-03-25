import express from "express";
const router = express.Router();

// Importing using your naming convention
import { protect } from "../middlewares/auth.middleware.js";
import { getEmployerAnalytics } from "../controllers/analytics.controller.js";

router.get("/overview", protect, getEmployerAnalytics);

export default router;
