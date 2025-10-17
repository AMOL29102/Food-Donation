import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createFood,
  getMyPosts, // <-- Import the new function
  getFoodById,
  updateFood,
  deleteFood,
  getBookingHistory,
} from "../controllers/providerController.js";

const router = express.Router();

// All routes in this file are protected
router.use(protect);

// ** FIX: Define the route to get all posts for the logged-in provider **
// This was the missing route causing the 404 error
router.get("/posts", getMyPosts);

// Route to create a new post
router.post("/posts", createFood);

// Routes for a single post by ID
router
  .route("/posts/:id")
  .get(getFoodById)
  .put(updateFood)
  .delete(deleteFood);

// Route for booking history
router.get("/history", getBookingHistory);

export default router;