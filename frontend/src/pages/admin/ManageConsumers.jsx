import React, { useEffect, useState } from 'react';
import { getConsumersRequest } from '../../api/adminApi'; // We will create this API call next
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const ManageConsumers = () => {
  const [consumers, setConsumers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsumers = async () => {
      try {
        const { data } = await getConsumersRequest();
        setConsumers(data);
      } catch (error) {
        toast.error("Failed to fetch consumers.");
      } finally {
        setLoading(false);
      }
    };
    fetchConsumers();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Manage <span className="text-green-500">Consumers</span></h1>
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-white">
            <thead className="border-b border-gray-700 font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Pincode</th>
                <th className="px-6 py-4">Joined On</th>
              </tr>
            </thead>
            <tbody>
                {console.log(consumers)}
              {consumers.map((consumer) => (
                <tr key={consumer._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="px-6 py-4">{consumer.name}</td>
                  <td className="px-6 py-4">{consumer.email}</td>
                  <td className="px-6 py-4">{consumer.pincode}</td>
                  <td className="px-6 py-4">{new Date(consumer.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageConsumers;