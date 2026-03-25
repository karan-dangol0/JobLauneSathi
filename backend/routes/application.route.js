import express from "express";
import * as ApplicationController from "../controllers/application.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:jobId", protect, ApplicationController.applyToJob);
router.get("/my", protect, ApplicationController.getMyApplications);
router.get("/job/:jobId", protect, ApplicationController.getApplicationForJob);
router.get("/:id", protect, ApplicationController.getApplicationById);
router.put("/:id/status", protect, ApplicationController.updateStatus);

export default router;