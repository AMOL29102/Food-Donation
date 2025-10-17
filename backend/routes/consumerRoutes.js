import express from "express";
import { protect, isConsumer } from "../middleware/authMiddleware.js";
import {
  getAvailableFood,
  bookFood,
  getConsumerBookings,
  cancelBooking,
} from "../controllers/consumerController.js";

const router = express.Router();

// All routes here are protected
router.use(protect);

// **FIX: This is the correct route for consumers to get food**
router.get("/available-food", getAvailableFood);

router.post("/book", bookFood);
router.get("/bookings", getConsumerBookings);
router.put("/bookings/:id/cancel", cancelBooking);

export default router;