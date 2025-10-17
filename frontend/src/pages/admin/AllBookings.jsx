import React, { useEffect, useState } from 'react';
import { getAllBookingsRequest } from '../../api/adminApi'; // We will create this API call next
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await getAllBookingsRequest();
        setBookings(data);
      } catch (error) {
        toast.error("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">All <span className="text-green-500">Bookings</span></h1>
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
    {console.log(bookings)}
          <table className="min-w-full text-left text-sm text-white">
            <thead className="border-b border-gray-700 font-medium">
              <tr>
                <th className="px-6 py-4">Food Item</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Consumer</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="px-6 py-4">{booking.food?.title || 'N/A'}</td>
                  <td className="px-6 py-4">{booking.provider?.name || 'N/A'}</td>
                  <td className="px-6 py-4">{booking.consumer?.name || 'N/A'}</td>
                  <td className="px-6 py-4">{booking.quantity}</td>
                  <td className="px-6 py-4">{new Date(booking.bookedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AllBookings;