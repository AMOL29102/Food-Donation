import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaUserTie, FaHistory, FaUserCog } from 'react-icons/fa';

const AdminDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Admin <span className="text-green-500">Dashboard</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          to="/admin/providers"
          icon={<FaUserTie className="text-4xl" />}
          title="Manage Providers"
          description="Approve or block provider accounts"
        />
        <DashboardCard
          to="/admin/consumers"
          icon={<FaUsers className="text-4xl" />}
          title="View Consumers"
          description="See all registered consumers"
        />
        <DashboardCard
          to="/admin/bookings"
          icon={<FaHistory className="text-4xl" />}
          title="Booking History"
          description="View all booking records"
        />
      </div>
    </motion.div>
  );
};

const DashboardCard = ({ to, icon, title, description }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-all"
    >
      <div className="text-green-500 mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  </Link>
);

export default AdminDashboard;