import express from "express";
import { protect, isProvider } from "../middleware/authMiddleware.js";
import {
  postFood,
  getProviderPosts,
  deleteFood,
  getFoodByPincode,
  getBookingHistory
} from "../controllers/providerController.js";

const router = express.Router();

// Note: 'available' food is a public-facing route for consumers, so it only needs 'protect'
router.get("/available", protect, getFoodByPincode);

// These routes are provider-specific and require the isProvider middleware
router.post("/post", protect, isProvider, postFood);
router.get("/myposts", protect, isProvider, getProviderPosts);
router.delete("/:id", protect, isProvider, deleteFood);
router.get("/history", protect, isProvider, getBookingHistory); // Add new route for history

export default router;