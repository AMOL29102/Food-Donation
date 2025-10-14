import Food from "../models/Food.js";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";

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

// Get consumer's bookings
export const getConsumerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ consumer: req.user._id, status: 'Booked' })
      .populate({
        path: 'food',
        select: 'title description expiresAt',
      })
      .populate('provider', 'name')
      .sort({ bookedAt: -1 });
    res.json(bookings);
  } catch (error) {
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