import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlusCircle, FaListAlt, FaUtensils, FaBookmark, FaHistory } from 'react-icons/fa';


const Dashboard = () => {
  const { user } = useAuth();

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const ActionCard = ({ to, icon, title, description }) => (
    <motion.div variants={cardVariants} whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 255, 127, 0.1)" }}>
      <Link to={to} className="block bg-gray-800 p-8 rounded-lg shadow-lg h-full transition-colors hover:bg-gray-700">
        <div className="text-green-500 mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </Link>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-6 py-12"
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="text-4xl md:text-5xl font-bold text-white mb-4"
      >
        Welcome back, <span className="text-green-500">{user?.name}!</span>
      </motion.h1>
      <motion.p
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-gray-400 mb-12"
      >
        What would you like to do today?
      </motion.p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
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