import Food from "../models/Food.js";
import Booking from "../models/Booking.js";


// Post food
export const postFood = async (req, res) => {
  const { title, description, quantity } = req.body;
  const food = await Food.create({
    provider: req.user._id,
    title,
    description,
    quantity,
    originalQuantity: quantity, // Set original quantity
    pincode: req.user.pincode,
  });
  res.status(201).json(food);
};

// Get provider posts
export const getProviderPosts = async (req, res) => {
  const posts = await Food.find({ provider: req.user._id }).sort({ createdAt: -1 });
  res.json(posts);
};

// Delete food
export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    // Authorization check
    if (food.provider.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this post" });
    }

    // Use deleteOne() instead of the deprecated remove()
    await food.deleteOne();

    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    console.error("Error deleting food:", error);
    res.status(500).json({ message: "Server error while deleting food" });
  }
};




// Get food for consumers by pincode
export const getFoodByPincode = async (req, res) => {
  try {
    console.log("Fetching food for pincode:", req.user.pincode);

    const foods = await Food.find({
      pincode: req.user.pincode,
      expiresAt: { $gt: new Date() }, // Only show valid (not expired)
    }).populate("provider", "name email");

    if (!foods || foods.length === 0) {
      return res.status(200).json([]); // Empty but not error
    }

    res.status(200).json(foods);
  } catch (error) {
    console.error("Error fetching food:", error.message);
    res.status(500).json({ message: "Server error fetching food" });
  }
};
export const getBookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id })
      .populate('consumer', 'name email')
      .populate('food', 'title')
      .sort({ bookedAt: -1 });
      
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching booking history:", error);
    res.status(500).json({ message: "Server error" });
  }
};