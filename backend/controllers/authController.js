import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "18h" });
};

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, mobile, role, pincode, address } = req.body;

    // --- Start of Validation ---
    if (!name || !password || !role || !pincode) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    // Role-specific validation
    if (role === 'provider' && (!mobile || !address)) {
      return res.status(400).json({ message: "Providers must supply a mobile number and address." });
    }
    // --- End of Validation ---

    // Check if user already exists (by email or mobile)
    const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (userExists) {
      return res.status(400).json({ message: "User with this email or mobile number already exists." });
    }

    // Create user object based on role
    const newUser = { name, email, password, role, pincode };
    if (role === 'provider') {
      newUser.mobile = mobile;
      newUser.address = address;
    }

    const user = await User.create(newUser);

    if (user) {
      res.status(201).json({
        message: "User registered successfully. Provider accounts require admin approval."
      });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    // ** FIX: Add detailed error logging **
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "An internal server error occurred during signup." });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    console.log('--- New Login Attempt ---');
    console.log('Received Identifier:', identifier);
    console.log('Received Role:', role);

    if (!identifier || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
      role
    });

    if (!user) {
      console.log('User lookup result: Not Found');
      return res.status(401).json({ message: `User not found or not registered as ${role}` });
    }
    console.log('User lookup result: Found user ->', user.email);

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Password match result: FAILED');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('Password match result: SUCCESS');

    if (role === 'provider' && !user.isApproved) {
      return res.status(403).json({ message: 'Your account is pending approval' });
    }

    // --- Start of JWT Diagnostic Logging ---
    console.log('Checking for JWT_SECRET...');
    if (!process.env.JWT_SECRET) {
      console.error('FATAL ERROR: JWT_SECRET is not defined in .env file!');
      // This is a server configuration error, so we stop here.
      return res.status(500).json({ message: 'Internal Server Error: JWT secret is missing.' });
    }
    console.log('JWT_SECRET found. Creating token...');
    // --- End of JWT Diagnostic Logging ---

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    console.log('Token created successfully. Sending response to client.');

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        pincode: user.pincode,
        address: user.address,
        isApproved: user.isApproved
      },
      token
    });
  } catch (error) {
    console.error('LOGIN FAILED WITH AN UNEXPECTED ERROR:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};