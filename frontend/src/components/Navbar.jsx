import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  // Call the hook inside the component to get the auth state
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900/80 backdrop-blur-md shadow-lg fixed top-0 left-0 right-0 z-50"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">
          <Link to="/">Food<span className="text-green-500">Rescue</span></Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-white">
          {user ? (
            <>
              {user.role === 'admin' && (
                <NavLink to="/admin" className={({ isActive }) => isActive ? "text-green-500" : "hover:text-green-500"}>Admin Panel</NavLink>
              )}
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-green-500" : "hover:text-green-500"}>Dashboard</NavLink>
              
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 hover:text-green-500">
                  <FaUserCircle className="text-2xl text-gray-300" />
                  <span className="font-medium">{user.name}</span>
                </Link>
              </div>
              <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? "text-green-500" : "hover:text-green-500"}>Login</NavLink>
              <NavLink to="/signup" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Sign Up</NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900"
          >
            <div className="flex flex-col px-4 py-2">
              {user ? (
                <>
                  <NavLink to="/profile" onClick={closeMenu} className="py-2 px-4 text-white hover:bg-gray-700 rounded">Profile ({user.name})</NavLink>
                  {user.role === 'admin' && (
                    <NavLink to="/admin" onClick={closeMenu} className="py-2 px-4 text-white hover:bg-gray-700 rounded">Admin Panel</NavLink>
                  )}
                  <NavLink to="/dashboard" onClick={closeMenu} className="py-2 px-4 text-white hover:bg-gray-700 rounded">Dashboard</NavLink>
                  <button onClick={() => { logout(); closeMenu(); }} className="mt-2 bg-red-600 text-white font-bold py-2 px-4 rounded-md">Logout</button>
                </>
              ) : (
                <>
                  <NavLink to="/login" onClick={closeMenu} className="py-2 px-4 text-white hover:bg-gray-700 rounded">Login</NavLink>
                  <NavLink to="/signup" onClick={closeMenu} className="py-2 px-4 text-white hover:bg-gray-700 rounded">Sign Up</NavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;