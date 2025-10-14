import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "18h" });
};

// Signup
export const signup = async (req, res) => {
  const { name, email, password, role, pincode } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ name, email, password, role, pincode });
  if (user) {
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, pincode: user.pincode },
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password, role } = req.body; // Role is now expected from the frontend

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // **CRITICAL**: Verify that the user's role matches the selected login role
  if (user.role !== role) {
    return res.status(403).json({ message: `You are not registered as a ${role}.` });
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      pincode: user.pincode,
    },
    token,
  });
};