import express from "express";
import {
  uploadFiles,
  getFiles,
  getFile,
  deleteFile,
  downloadFile,
  toggleStar,
  renameFile,
} from "../controllers/fileController.js";
import multer from "multer";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Protect all routes
router.use(isAuthenticated);

router.post("/upload", upload.array("files"), uploadFiles);
router.get("/", getFiles);
router.get("/:id", getFile);
router.delete("/:id", deleteFile);
router.get("/:id/download", downloadFile);
router.patch("/:id/star", toggleStar);
router.patch("/:id/rename", renameFile);

export default router;
