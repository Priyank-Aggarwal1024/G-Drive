import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
  createFolder,
  getFolders,
  getFolder,
  updateFolder,
  deleteFolder,
  toggleStar,
} from "../controllers/folderController.js";

const router = express.Router();

// Protect all routes
router.use(isAuthenticated);

router.post("/", createFolder);
router.get("/", getFolders);
router.get("/:id", getFolder);
router.put("/:id", updateFolder);
router.delete("/:id", deleteFolder);
router.patch("/:id/star", toggleStar);

export default router;
