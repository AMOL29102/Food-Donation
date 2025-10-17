import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

// --- Corrected Imports ---
// This is the view for consumers, showing all available food.
import AvailableFood from './AvailableFood'; 
// This is the new dashboard view specifically for providers.
import ProviderDashboard from './ProviderDashboard'; 

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Render the correct component based on the user's role
  switch (user.role) {
    case 'consumer':
      return <AvailableFood />;
    case 'provider':
      return <ProviderDashboard />;
    case 'admin':
      // Redirect admins to their correct dashboard if they land here by mistake
      return <Navigate to="/admin" />;
    default:
      // If role is unknown for any reason, send back to login
      return <Navigate to="/login" />;
  }
};

export default Dashboard;