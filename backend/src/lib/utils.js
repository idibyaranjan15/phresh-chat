import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "../constants.js";

export const generateToken = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

    // Set the token as an HTTP-only cookie
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true,
      sameSite: "strict",
      secure: NODE_ENV !== "development", // Secure flag for production
    });

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate token");
  }
};

// Utility for sending error responses
export const sendResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ message });
};
