import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Food',
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  consumer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Booked', 'Cancelled'],
    default: 'Booked',
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;