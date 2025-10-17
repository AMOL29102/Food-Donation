import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import {
  getProviders,
  getConsumers,
  approveProvider,
  blockProvider,
  getAllBookings, // <-- Import the new function
} from '../controllers/adminController.js';

const router = express.Router();

// Protect all routes and ensure admin access
router.use(protect, isAdmin);

// Define the route for getting all providers
router.get('/providers', getProviders);

// Define other routes for admin actions
router.get('/consumers', getConsumers);
router.put('/providers/:id/approve', approveProvider);
router.put('/providers/:id/block', blockProvider);
router.get('/bookings', getAllBookings); // <-- Route for all bookings

export default router;