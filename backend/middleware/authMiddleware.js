import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};


// Middleware to check for 'provider' role
export const isProvider = (req, res, next) => {
  if (req.user && req.user.role === 'provider') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Providers only.' });
  }
};

// Middleware to check for 'consumer' role
export const isConsumer = (req, res, next) => {
  if (req.user && req.user.role === 'consumer') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Consumers only.' });
  }
};