import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages & Components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from './pages/Dashboard';
import MyPosts from "./pages/MyPosts";
import MyBookings from "./pages/MyBookings";
import PostFood from './pages/PostFood';
import AvailableFood from "./pages/AvailableFood";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Shared/Navbar";
import Footer from "./components/Shared/Footer";
import BookingHistory from "./pages/BookingHistory";
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProviders from './pages/admin/ManageProviders';
import ManageConsumers from './pages/admin/ManageConsumers'; // <-- Import new component
import AllBookings from './pages/admin/AllBookings';       // <-- Import new component
import EditPost from './pages/EditPost'; // Import the new page
import Profile from './pages/Profile'; // Import the new page

// --- Helper Components for Route Protection ---

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

// General protected route for any logged-in user
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return user ? children : <Navigate to="/login" replace />;
};

// Route for admin users only
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return user?.role === 'admin' ? children : <Navigate to="/" replace />;
};

// ** FIX: Define ProviderRoute **
// Route for provider users only
const ProviderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return user?.role === 'provider' ? children : <Navigate to="/dashboard" replace />;
};

// ** FIX: Define ConsumerRoute **
// Route for consumer users only
const ConsumerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return user?.role === 'consumer' ? children : <Navigate to="/dashboard" replace />;
};


// ** FIX: Create a component to handle animated routes **
// This is necessary because useLocation must be used inside a Router component.
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Shared Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/available-food" element={<ProtectedRoute><AvailableFood /></ProtectedRoute>} />

        {/* Provider-Only Routes (cleaned up duplicates) */}
        <Route path="/post-food" element={<ProviderRoute><PostFood /></ProviderRoute>} />
        <Route path="/my-posts" element={<ProviderRoute><MyPosts /></ProviderRoute>} />
        <Route path="/booking-history" element={<ProviderRoute><BookingHistory /></ProviderRoute>} />
        <Route path="/edit-post/:id" element={<ProviderRoute><EditPost /></ProviderRoute>} />

        {/* Consumer-Only Routes */}
        <Route path="/my-bookings" element={<ConsumerRoute><MyBookings /></ConsumerRoute>} />

        {/* Admin-Only Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/providers" element={<AdminRoute><ManageProviders /></AdminRoute>} />
        {/* **FIX: Add routes for the new admin pages** */}
        <Route path="/admin/consumers" element={<AdminRoute><ManageConsumers /></AdminRoute>} />
        <Route path="/admin/bookings" element={<AdminRoute><AllBookings /></AdminRoute>} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
      <AuthProvider>
        <ToastContainer theme="dark" position="bottom-right" />
        <Navbar />
        <main className="min-h-[calc(100vh-80px)] pt-20 bg-gray-900 text-white">
          <AnimatedRoutes />
        </main>
        {/* <Footer /> You can add your footer back here if you have one */}
      </AuthProvider>
  )
}

export default App;