import { json } from "express";
import { generateToken, sendResponse } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/couldnary.js";

// Signup Controller
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Validate input fields
    if (!fullName || !email || !password) {
      return sendResponse(res, 400, "All fields are required");
    }
    if (password.length < 6) {
      return sendResponse(
        res,
        400,
        "Password must be at least 6 characters long"
      );
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 400, "Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // Generate token and set cookie
    generateToken(newUser._id, res);

    // Send success response
    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    return sendResponse(res, 500, "Internal server error");
  }
};

// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input fields
    if (!email || !password) {
      return sendResponse(res, 400, "All fields are required");
    }
    if (password.length < 6) {
      return sendResponse(res, 400, "Password must be at least 6 characters");
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return sendResponse(res, 400, "Invalid credentials");
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return sendResponse(res, 400, "Invalid credentials");
    }

    // Generate token and set cookie
    generateToken(existingUser._id, res);

    // Send success response
    return res.status(200).json({
      _id: existingUser._id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      profilePic: existingUser.profilePic,
      message: `Hello! ${existingUser.fullName}",`,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    return sendResponse(res, 500, "Internal server error");
  }
};

// Logout Controller
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return sendResponse(res, 200, "Logged out successfully");
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    return sendResponse(res, 500, "Internal server error");
  }
};

//update-profile

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return sendResponse(res, 400, "Profile pic is required");
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
