import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-900 shadow-lg' : 'bg-gray-800'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-2xl text-white tracking-wider">
          Rescue<span className="text-green-500">Bites</span>
        </Link>
        <div className="flex items-center gap-6 text-white">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-green-500 transition-colors">Dashboard</Link>
              
              {/* Role-specific links */}
              {user.role === 'consumer' && (
                <>
                  <Link to="/available-food" className="text-gray-300 hover:text-green-500 transition-colors">Available Food</Link>
                  <Link to="/my-bookings" className="text-gray-300 hover:text-green-500 transition-colors">My Bookings</Link>
                </>
              )}
              {user.role === 'provider' && (
                <>
                  <Link to="/post-food" className="text-gray-300 hover:text-green-500 transition-colors">Post Food</Link>
                  <Link to="/my-posts" className="text-gray-300 hover:text-green-500 transition-colors">My Posts</Link>
                </>
              )}

              <div className="flex items-center gap-3">
                <FaUserCircle className="text-2xl text-gray-300" />
                <span className="font-medium">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-semibold">
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-4">
              {/* <Link to="/available-food" className="text-gray-300 hover:text-green-500 transition-colors">Available Food</Link> */}
              <Link to="/login" className="px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">Login</Link>
              <Link to="/signup" className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-semibold">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;