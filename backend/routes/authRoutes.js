import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import {
  validateRegistration,
  validateLogin,
} from "../validators/auth.validator.js";

const router = express.Router();

// Register route
router.post(
  "/register",
  (req, res, next) => {
    const { isValid, errors } = validateRegistration(req.body);
    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }
    next();
  },
  registerUser
);

// Login route
router.post(
  "/login",
  (req, res, next) => {
    const { isValid, errors } = validateLogin(req.body);
    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }
    next();
  },
  loginUser
);

export default router;
