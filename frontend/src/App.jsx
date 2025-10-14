import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages & Components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MyPosts from "./pages/MyPosts";
import MyBookings from "./pages/MyBookings";
import PostFood from "./pages/PostFood";
import AvailableFood from "./pages/AvailableFood";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Shared/Navbar";
import Footer from "./components/Shared/Footer";
import BookingHistory from "./pages/BookingHistory"; // Import the new page


// Generic Private Route
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div></div>;
  return user ? children : <Navigate to="/login" replace />;
};

// Role-specific Routes
const ProviderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div></div>;
  return user && user.role === 'provider' ? children : <Navigate to="/dashboard" replace />;
};

const ConsumerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div></div>;
  return user && user.role === 'consumer' ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  const location = useLocation();
  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" />
      <Navbar />
      <main className="min-h-[calc(100vh-80px)] pt-20">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Routes for All Logged-in Users */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/available-food" element={<PrivateRoute><AvailableFood /></PrivateRoute>} />

            {/* Provider-Only Routes */}
            <Route path="/post-food" element={<ProviderRoute><PostFood /></ProviderRoute>} />
            <Route path="/my-posts" element={<ProviderRoute><MyPosts /></ProviderRoute>} />
            <Route path="/post-food" element={<ProviderRoute><PostFood /></ProviderRoute>} />
            <Route path="/my-posts" element={<ProviderRoute><MyPosts /></ProviderRoute>} />
            <Route path="/booking-history" element={<ProviderRoute><BookingHistory /></ProviderRoute>} /> {/* Add the new route */}
            {/* Consumer-Only Routes */}
            <Route path="/my-bookings" element={<ConsumerRoute><MyBookings /></ConsumerRoute>} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}

export default App;