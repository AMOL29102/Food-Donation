import express from "express";
import { protect, isConsumer } from "../middleware/authMiddleware.js";
import {
  bookFood,
  getConsumerBookings,
  cancelBooking, // Import new controller
} from "../controllers/consumerController.js";

const router = express.Router();

// All consumer routes require the user to be a consumer
router.post("/book/:id", protect, isConsumer, bookFood);
router.get("/mybookings", protect, isConsumer, getConsumerBookings);
router.delete("/cancel/:id", protect, isConsumer, cancelBooking); // Add new route for cancelling

export default router;