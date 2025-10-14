import React, { useEffect, useState } from 'react';
import { getBookingHistoryRequest } from '../api/providerApi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const BookingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getBookingHistoryRequest();
        setHistory(data);
      } catch (error) {
        toast.error("Failed to fetch booking history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

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
      className="container mx-auto px-6 py-12"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
        Booking <span className="text-green-500">History</span>
      </h1>
      {history.length > 0 ? (
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full text-left text-sm font-light text-white">
            <thead className="border-b border-gray-700 font-medium">
              <tr>
                <th scope="col" className="px-6 py-4">Food Item</th>
                <th scope="col" className="px-6 py-4">Consumer</th>
                <th scope="col" className="px-6 py-4">Quantity</th>
                <th scope="col" className="px-6 py-4">Date</th>
                <th scope="col" className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-700 transition duration-300 ease-in-out hover:bg-gray-700/50"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium">{item.food?.title || 'N/A'}</td>
                  <td className="whitespace-nowrap px-6 py-4">{item.consumer.name}</td>
                  <td className="whitespace-nowrap px-6 py-4">{item.quantity}</td>
                  <td className="whitespace-nowrap px-6 py-4">{new Date(item.bookedAt).toLocaleString()}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {item.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-400 text-xl mt-16">No booking history found.</p>
      )}
    </motion.div>
  );
};

export default BookingHistory;