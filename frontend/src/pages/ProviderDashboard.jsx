import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlusCircle } from 'react-icons/fa';
// You would also import your component that shows the provider's own food listings here
// For example: import MyFoodListings from '../components/MyFoodListings';

const ProviderDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">
          Provider <span className="text-green-500">Dashboard</span>
        </h1>
        <Link to="/post-food">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2"
          >
            <FaPlusCircle /> Post New Food
          </motion.button>
        </Link>
      </div>

      {/* 
        This is where you would render the list of food items
        that this specific provider has posted.
      */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">My Listings</h2>
        <p className="text-gray-400">
          {/* Placeholder: Replace this with your actual component */}
          Your food listings will appear here.
          {/* <MyFoodListings /> */}
        </p>
      </div>
    </motion.div>
  );
};

export default ProviderDashboard;