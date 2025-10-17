import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaCheck, FaBan } from 'react-icons/fa';
import { getProvidersRequest, approveProviderRequest, blockProviderRequest } from '../../api/adminApi';

const ManageProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const {data} = await getProvidersRequest();
      setProviders(data);
    } catch (error) {
      toast.error('Failed to fetch providers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    try {
      await (currentStatus ? blockProviderRequest(id) : approveProviderRequest(id));
      toast.success(`Provider ${currentStatus ? 'blocked' : 'approved'} successfully`);
      fetchProviders();
    } catch (error) {
      toast.error('Failed to update provider status');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500" />
    </div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Manage <span className="text-green-500">Providers</span>
      </h1>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {providers.map((provider) => (
                <tr key={provider._id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {provider.name}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    <div>{provider.email}</div>
                    <div>{provider.mobile}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    <div>{provider.address}</div>
                    <div>Pincode: {provider.pincode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      provider.isApproved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {provider.isApproved ? 'Approved' : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(provider._id, provider.isApproved)}
                        className={`p-2 rounded-full ${
                          provider.isApproved 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                        title={provider.isApproved ? 'Block Provider' : 'Approve Provider'}
                      >
                        {provider.isApproved ? <FaBan /> : <FaCheck />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageProviders;