import User from '../models/User.js';
import Booking from '../models/Booking.js'; // <-- Make sure Booking is imported

// Function to get all users with the 'provider' role
export const getProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: 'provider' })
      .select('-password') // Exclude password from the result
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(providers);
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ message: 'Server error while fetching providers.' });
  }
};

// Function to approve a provider
export const approveProvider = async (req, res) => {
  try {
    const provider = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).select('-password');
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to block (disapprove) a provider
export const blockProvider = async (req, res) => {
  try {
    const provider = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    ).select('-password');
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get all users with the 'consumer' role
export const getConsumers = async (req, res) => {
  try {
    const consumers = await User.find({ role: 'consumer' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(consumers);
  } catch (error) {
    console.error('Error fetching consumers:', error);
    res.status(500).json({ message: 'Server error while fetching consumers.' });
  }
};

// **FIX: Add function to get ALL bookings for the admin**
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('food', 'title')
      .populate('provider', 'name')
      .populate('consumer', 'name')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Server error while fetching all bookings.' });
  }
};