import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateToken } from "../services/auth.service.js";
import dotenv from "dotenv";

dotenv.config();

export const isAuthenticated = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "No tokens, authorization denied" });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      console.log(decoded);
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return res.status(401).json({ message: "Refresh token expired" });
      }
      const token = generateToken(decoded.id);
      res.setHeader("Authorization", "Bearer " + token);
    } catch (error) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
  }
  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res
          .status(401)
          .json({ message: "Token expired and no refresh token" });
      }

      try {
        const refreshDecoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        if (refreshDecoded.exp && Date.now() >= refreshDecoded.exp * 1000) {
          return res
            .status(401)
            .json({ message: "Refresh token also expired" });
        }
        const newToken = generateToken(refreshDecoded.id);
        res.setHeader("Authorization", "Bearer " + newToken);
        decoded = jwt.verify(newToken, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
