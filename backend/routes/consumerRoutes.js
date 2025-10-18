import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getAvailableFood, 
  createBooking, // **FIX: Use the correct function name**
  getConsumerBookings, 
  cancelBooking 
} from '../controllers/consumerController.js';

const router = express.Router();

router.use(protect);

router.get('/available-food', getAvailableFood);

// **FIX: This route should be a POST and not have URL params**
router.post('/book', createBooking);

router.get('/bookings', getConsumerBookings);
router.put('/bookings/:id/cancel', cancelBooking);

export default router;