import express from "express";
import {
  logActivityController,
  getUserActivityController,
  clearUserActivityController,
} from "../controllers/recentActivity.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();
router.use(isAuthenticated);
router.post("/", logActivityController); // Log new activity
router.get("/", getUserActivityController); // Get user activity
router.delete("/", clearUserActivityController); // Clear activity

export default router;
