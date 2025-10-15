import React, { useEffect, useState } from 'react';
import { getConsumerBookings, cancelBookingRequest } from '../api/consumerApi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaUtensils, FaUser, FaClock, FaTrash } from 'react-icons/fa';

const BookingCard = ({ booking, onCancel }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
    className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between"
  >
    <div>
      <h3 className="text-2xl font-bold text-white mb-2">{booking.food.title}</h3>
      <div className="space-y-2 text-gray-300 border-t border-gray-700 pt-4 mt-4">
        <div className="flex items-center gap-2"><FaUtensils className="text-green-500" /><span>Quantity Booked: {booking.quantity}</span></div>
        <div className="flex items-center gap-2"><FaUser className="text-green-500" /><span>Provider: {booking.provider.name}</span></div>
        <div className="flex items-center gap-2"><FaClock className="text-green-500" /><span>Expires: {new Date(booking.food.expiresAt).toLocaleString()}</span></div>
      </div>
    </div>
    <motion.button
      onClick={() => onCancel(booking._id)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full mt-6 bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
    >
      <FaTrash /> Cancel Booking
    </motion.button>
  </motion.div>
);

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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
        My <span className="text-green-500">Bookings</span>
      </h1>
      {bookings.length > 0 ? (
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <p className="text-center text-gray-400 text-xl mt-16">You have not booked any food items yet.</p>
      )}
    </motion.div>
  );
};

export default MyBookings;