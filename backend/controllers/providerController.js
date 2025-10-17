import Food from '../models/Food.js';
import Booking from '../models/Booking.js';

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

// Create food with expiration
export const createFood = async (req, res) => {
  try {
    const { title, description, quantity, pincode, expiresInHours } = req.body;

    if (!title || !description || !quantity || !pincode || !expiresInHours) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const expiresAt = new Date(Date.now() + Number(expiresInHours) * 60 * 60 * 1000);

    const food = new Food({
      title,
      description,
      quantity,
      originalQuantity: quantity, // **FIX: Set originalQuantity to the initial quantity**
      pincode,
      expiresAt,
      provider: req.user._id,
    });

    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (error) {
    // This console.error is what gave you the helpful error message
    console.error("Error creating food post:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get provider posts
export const getProviderPosts = async (req, res) => {
  const posts = await Food.find({ provider: req.user._id }).sort({ createdAt: -1 });
  res.json(posts);
};

// ** FIX: Add the function to get all posts for the logged-in provider **
// @desc    Get all food posts by the logged-in provider
// @route   GET /api/provider/posts
// @access  Private
export const getMyPosts = async (req, res) => {
  try {
    // Find all food items where the provider field matches the logged-in user's ID
    const foods = await Food.find({ provider: req.user._id }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    console.error('Error fetching provider posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a food post
// @route   DELETE /api/provider/posts/:id
// @access  Private
export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food post not found' });
    }

    // Ensure the provider owns this post
    if (food.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await food.deleteOne(); // Use deleteOne() on the document
    res.json({ message: 'Food post removed successfully' });
  } catch (error) {
    console.error('Error deleting food post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get food for consumers by pincode
export const getFoodByPincode = async (req, res) => {
  try {
    const foods = await Food.find({
      pincode: req.user.pincode,
      quantity: { $gt: 0 },
      expiresAt: { $gt: new Date() }
    }).populate('provider', 'name mobile address pincode');
    
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get booking history for the logged-in provider
export const getBookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id })
      // **FIX: Populate both food and consumer details**
      .populate('food', 'title expiresAt') // Select the title and expiresAt fields from the Food model
      .populate('consumer', 'name email') // Select name and email from the User model
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching provider booking history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single food post by ID
// @route   GET /api/provider/posts/:id
// @access  Private
export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food post not found' });
    }

    // Ensure the provider owns this post
    if (food.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this post' });
    }

    res.json(food);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a food post
// @route   PUT /api/provider/posts/:id
// @access  Private
export const updateFood = async (req, res) => {
  try {
    const { title, description, quantity, expiresInHours } = req.body;
    let food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food post not found' });
    }

    // Ensure the provider owns this post
    if (food.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    // Update fields
    food.title = title || food.title;
    food.description = description || food.description;
    food.quantity = quantity || food.quantity;
    if (expiresInHours) {
      food.expiresAt = new Date(Date.now() + Number(expiresInHours) * 60 * 60 * 1000);
    }

    const updatedFood = await food.save();
    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};