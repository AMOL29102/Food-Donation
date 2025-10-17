import React, { useEffect, useState } from 'react';
import { getAvailableFood, bookFoodRequest } from '../api/consumerApi';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUtensils, FaMapMarkerAlt, FaUser, FaClock, FaPhone } from 'react-icons/fa';

// Quantity Modal Component
const QuantityModal = ({ food, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);

  const handleConfirm = () => {
    const numQuantity = Number(quantity);
    if (numQuantity > 0 && numQuantity <= food.quantity) {
      onConfirm(numQuantity);
    } else {
      toast.error(`Please enter a quantity between 1 and ${food.quantity}.`);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-white mb-2">Book: {food.title}</h3>
        <p className="text-gray-400 mb-4">Available for {food.quantity} people.</p>
        <label htmlFor="quantity" className="block text-gray-300 mb-2">How many servings?</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
          min="1"
          max={food.quantity}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
        />
        <div className="flex gap-4 mt-6">
          <button onClick={onClose} className="flex-1 bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-500">Cancel</button>
          <button onClick={handleConfirm} className="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700">Confirm</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// FoodCard Component
const FoodCard = ({ food, onBook }) => {
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div variants={cardVariants} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
      <div className="p-6 flex-grow">
       {console.log(food)}
        <h3 className="text-2xl font-bold text-white mb-2">{food.title}</h3>
        <p className="text-gray-400 mb-4">{food.description}</p>
        <div className="space-y-2 text-gray-300">
          <div className="flex items-center gap-2">
            <FaUtensils className="text-green-500" />
            <span>Quantity: {food.quantity}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUser className="text-green-500" />
            <span>Provider: {food.provider?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaPhone className="text-green-500" />
            <span>Contact: {food.provider?.mobile}</span>
          </div>
          <div className="flex items-start gap-2">
            <FaMapMarkerAlt className="text-green-500 mt-1" />
            <div>
              <p>Address:</p>
              <p className="text-gray-400">{food.provider?.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-green-500" />
            <span>Expires: {new Date(food.expiresAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="p-6 bg-gray-800/50">
        <motion.button
          onClick={() => onBook(food)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          Book Now
        </motion.button>
      </div>
    </motion.div>);
};

// Main AvailableFood Component
const AvailableFood = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);

  const fetchAvailableFood = async () => {
    try {
      setLoading(true);
      const data = await getAvailableFood();
      setFoods(data);
    } catch (error) {
      toast.error('Failed to fetch available food.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableFood();
  }, []);

  const handleOpenModal = (food) => {
    setSelectedFood(food);
  };

  // **FIX**: This function was missing. It handles the API call after quantity is confirmed.
  const handleConfirmBooking = async (quantity) => {
    if (!selectedFood) return;

    try {
      await bookFoodRequest(selectedFood._id, quantity);
      toast.success('Food booked successfully!');
      setSelectedFood(null); // Close the modal
      fetchAvailableFood(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book food.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const availableFoods = foods.filter(food => food.quantity > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-6 py-12"
    >
      <AnimatePresence>
        {selectedFood && (
          <QuantityModal
            food={selectedFood}
            onClose={() => setSelectedFood(null)}
            onConfirm={handleConfirmBooking} // **FIX**: Pass the correct function here
          />
        )}
      </AnimatePresence>
      
      <h1 className="text-4xl md-text-5xl font-bold text-white mb-8 text-center">
        Available <span className="text-green-500">Food</span> Donations
      </h1>
     {availableFoods.length > 0 ? ( // or posts.length, bookings.length
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {availableFoods.map((food) => (
            <FoodCard key={food._id} food={food} onBook={handleOpenModal} />
          ))}
        </motion.div>
      ) : (
        <p className="text-center text-gray-400 text-xl mt-16">No food is currently available. Please check back later.</p>
      )}
    </motion.div>
  );
};

export default AvailableFood;