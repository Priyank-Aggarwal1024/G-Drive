import {
  generateToken,
  registerUserService,
  loginUserService,
  generateRefreshToken,
} from "../services/auth.service.js";
import dotenv from "dotenv";
import { getUserProfileService } from "../services/user.service.js";

dotenv.config();

const registerUser = async (req, res) => {
  try {
    const user = await registerUserService(req.body);
    const token = generateToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 180 * 24 * 60 * 60 * 1000,
    });
    const userProfile = await getUserProfileService(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token: token,
      user: userProfile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Server error", error: error });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await loginUserService(req.body);
    const token = generateToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 180 * 24 * 60 * 60 * 1000,
    });
    const userProfile = await getUserProfileService(user._id);
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: userProfile,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: error.message || "Server error", error: error });
  }
};

export { registerUser, loginUser };
