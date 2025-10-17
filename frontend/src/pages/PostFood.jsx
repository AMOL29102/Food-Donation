import React, { useState } from 'react';
import { createPostRequest } from '../api/providerApi'; // Corrected function name for consistency
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaUtensils, FaFileAlt, FaBox } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // **FIX: Import useAuth to access user data**

const PostFood = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // **FIX: Get the logged-in user from the context**
  const [form, setForm] = useState({
    title: '',
    description: '',
    quantity: '',
    expiresInHours: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // **FIX: Create a new payload that includes the user's pincode**
      const payload = {
        ...form,
        pincode: user.pincode, // The backend requires the pincode
      };
      await createPostRequest(payload); // Use the correct API function name
      toast.success('Food donation posted successfully!');
      navigate('/my-posts');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post food donation.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen px-4"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-white">Post a New Food Donation</h2>
        <p className="text-center text-gray-400">Your post will be listed for your pincode: <span className="font-bold text-green-500">{user.pincode}</span></p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-300">Food Title</label>
            <div className="relative">
              <FaUtensils className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" name="title" id="title" value={form.title} onChange={handleChange} placeholder="e.g., Leftover Pizza Slices" required className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white" />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-300">Description</label>
            <div className="relative">
              <FaFileAlt className="absolute left-3 top-4 text-gray-400" />
              <textarea name="description" id="description" value={form.description} onChange={handleChange} placeholder="e.g., 5 slices of vegetarian pizza, fresh from today." required rows="4" className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white" />
            </div>
          </div>
          <div>
            <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-300">Quantity (servings)</label>
            <div className="relative">
              <FaBox className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="number" name="quantity" id="quantity" value={form.quantity} onChange={handleChange} placeholder="e.g., 2" required min="1" className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white" />
            </div>
          </div>
          <div>
            <label htmlFor="expiresInHours" className="block text-sm font-medium text-gray-300 mb-2">Available For (Hours)</label>
            <div className="relative">
              <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="number" name="expiresInHours" id="expiresInHours" value={form.expiresInHours} onChange={handleChange} required min="1" placeholder="e.g., 6" className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white" />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 transition-colors duration-300"
          >
            Post Food
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PostFood;