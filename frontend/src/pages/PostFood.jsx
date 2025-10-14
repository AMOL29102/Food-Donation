import React, { useState } from 'react';
import { postFoodRequest } from '../api/providerApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PostFood = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    quantity: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postFoodRequest(form);
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
        <p className="text-center text-gray-400">Fill out the details below to list your surplus food.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-300">Food Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Leftover Pizza Slices"
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-300">Description</label>
            <textarea
              name="description"
              id="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g., 5 slices of vegetarian pizza, fresh from today."
              required
              rows="4"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-300">Quantity (e.g., for how many people)</label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g., 2"
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
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