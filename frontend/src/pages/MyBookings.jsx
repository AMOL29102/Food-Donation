import React, { useEffect, useState } from 'react';
import { getConsumerBookings, cancelBookingRequest } from '../api/consumerApi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaUtensils, FaUser, FaClock, FaTrash, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const BookingCard = ({ booking, onCancel }) => {
  // **FIX: Check if the food item has expired**
  const isExpired = new Date(booking.food?.expiresAt) < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      // **FIX: Apply different styles for expired cards**
      className={`h-full bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col ${isExpired ? 'opacity-50' : ''}`}
    >
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-bold text-white mb-4">{booking.food?.title}</h3>
          {/* **FIX: Show an "Expired" badge** */}
          {isExpired && (
            <span className="bg-red-500/20 text-red-400 text-xs font-semibold px-2 py-1 rounded-full">
              Expired
            </span>
          )}
        </div>
        <div className="space-y-3 text-gray-300 border-t border-gray-700 pt-4">
          <div className="flex items-center gap-2">
            <FaUtensils className="text-green-500 flex-shrink-0" />
            <span>Quantity Booked: {booking.quantity}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUser className="text-green-500 flex-shrink-0" />
            <span>Provider: {booking.provider?.name}</span>
          </div>
          {/* **FIX: Added Provider Contact Number** */}
          <div className="flex items-center gap-2">
            <FaPhone className="text-green-500 flex-shrink-0" />
            <span>Contact: {booking.provider?.mobile}</span>
          </div>
          {/* **FIX: Added Provider Address** */}
          <div className="flex items-start gap-2">
            <FaMapMarkerAlt className="text-green-500 flex-shrink-0 mt-1" />
            <span>Address: {booking.provider?.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-green-500 flex-shrink-0" />
            <span>Expired On: {new Date(booking.food?.expiresAt || Date.now()).toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="p-6 bg-gray-800/50 border-t border-gray-700">
        <motion.button
          onClick={() => onCancel(booking._id)}
          whileHover={{ scale: isExpired ? 1 : 1.05 }}
          whileTap={{ scale: isExpired ? 1 : 0.95 }}
          // **FIX: Disable button for expired bookings**
          disabled={isExpired}
          className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          <FaTrash /> Cancel Booking
        </motion.button>
      </div>
    </motion.div>
  );
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getConsumerBookings();
      setBookings(data);
    } catch (error) {
      toast.error("Failed to fetch your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBookingRequest(bookingId);
        toast.success('Booking cancelled successfully!');
        setBookings(bookings.filter(b => b._id !== bookingId));
      } catch (error) {
        toast.error('Failed to cancel booking.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 sm:px-6 py-12"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
        My <span className="text-green-500">Bookings</span>
      </h1>
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          <AnimatePresence>
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-center text-gray-400 text-xl mt-16">You haven't made any bookings yet.</p>
      )}
    </motion.div>
  );
};

export default MyBookings;