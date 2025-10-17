import Food from '../models/Food.js';
import Booking from '../models/Booking.js';
import mongoose from 'mongoose';

// Book food
export const bookFood = async (req, res) => {
  const { quantity } = req.body;
  const foodId = req.params.id;
  const consumerId = req.user._id;

  console.log(quantity," ",foodId," ",consumerId);

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be a positive number." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const food = await Food.findById(foodId).session(session);

    if (!food) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Food not found." });
    }
    if (food.quantity < quantity) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Not enough quantity available." });
    }
    if (food.expiresAt < new Date()) {
      await session.abortTransaction();
      return res.status(400).json({ message: "This food donation has expired." });
    }

    // Decrease food quantity
    food.quantity -= quantity;
    if (food.quantity === 0) {
      food.status = 'Booked';
    }
    await food.save({ session });

    // Create a new booking record
    const booking = new Booking({
      food: foodId,
      provider: food.provider,
      consumer: consumerId,
      quantity,
    });
    await booking.save({ session });

    await session.commitTransaction();
    res.status(201).json(booking);
  } catch (error) {
    await session.abortTransaction();
    console.error("Booking error:", error);
    res.status(500).json({ message: "Server error during booking." });
  } finally {
    session.endSession();
  }
};

// @desc    Get all available food for a consumer based on their pincode
// @route   GET /api/consumer/available-food
// @access  Private
export const getAvailableFood = async (req, res) => {
  try {
    const foods = await Food.find({
      pincode: req.user.pincode,
      quantity: { $gt: 0 },
      expiresAt: { $gt: new Date() }
    })
    .populate('provider', 'name address mobile')
    .sort({ createdAt: -1 });
    
    res.json(foods);
  } catch (error) {
    console.error("Error fetching available food:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all ACTIVE bookings for the logged-in consumer
export const getConsumerBookings = async (req, res) => {
  try {
    // **FIX: Use an aggregation pipeline to get bookings only for non-expired food**
    const bookings = await Booking.aggregate([
      { $match: { consumer: new mongoose.Types.ObjectId(req.user._id) } },
      { $lookup: { from: 'foods', localField: 'food', foreignField: '_id', as: 'foodDetails' } },
      { $unwind: '$foodDetails' },
      { $match: { 'foodDetails.expiresAt': { $gt: new Date() } } }, // Filter out expired
      { $lookup: { from: 'users', localField: 'provider', foreignField: '_id', as: 'providerDetails' } },
      { $unwind: '$providerDetails' },
      {
        $project: {
          _id: 1, quantity: 1, createdAt: 1,
          food: { _id: '$foodDetails._id', title: '$foodDetails.title', expiresAt: '$foodDetails.expiresAt' },
          provider: { _id: '$providerDetails._id', name: '$providerDetails.name', address: '$providerDetails.address', mobile: '$providerDetails.mobile' }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching consumer bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  const bookingId = req.params.id;
  const consumerId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(bookingId).session(session);

    if (!booking || booking.consumer.toString() !== consumerId.toString()) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Booking not found or not authorized." });
    }
    if (booking.status === 'Cancelled') {
      await session.abortTransaction();
      return res.status(400).json({ message: "Booking already cancelled." });
    }

    // Restore the quantity to the food item
    await Food.findByIdAndUpdate(booking.food, { $inc: { quantity: booking.quantity }, status: 'Available' }, { session });

    // Mark booking as cancelled
    booking.status = 'Cancelled';
    await booking.save({ session });

    await session.commitTransaction();
    res.json({ message: "Booking cancelled successfully." });
  } catch (error) {
    await session.abortTransaction();
    console.error("Cancellation error:", error);
    res.status(500).json({ message: "Server error during cancellation." });
  } finally {
    session.endSession();
  }
};