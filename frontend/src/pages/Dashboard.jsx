import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlusCircle, FaListAlt, FaUtensils, FaBookmark, FaHistory } from 'react-icons/fa';


const Dashboard = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 sm:px-6 py-12"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">
        Welcome, <span className="text-green-500">{user?.name}</span>
      </h1>
      <p className="text-center text-gray-400 text-lg mb-12">What would you like to do today?</p>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {user?.role === 'provider' ? (
          <>
            <ActionCard
              to="/post-food"
              icon={<FaPlusCircle size={40} />}
              title="Post New Food"
              description="Share surplus food and make a new donation post."
            />
            <ActionCard
              to="/my-posts"
              icon={<FaListAlt size={40} />}
              title="My Posts"
              description="View and manage all your previous food donation posts."
            />
            <ActionCard
              to="/booking-history"
              icon={<FaHistory size={40} />}
              title="Booking History"
              description="See a complete record of all bookings made for your items."
            />
          </>
        ) : (
          <>
            <ActionCard
              to="/available-food"
              icon={<FaUtensils size={40} />}
              title="Available Food"
              description="Browse all available food donations from providers."
            />
            <ActionCard
              to="/my-bookings"
              icon={<FaBookmark size={40} />}
              title="My Bookings"
              description="Check the status of all the food items you have booked."
            />
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;