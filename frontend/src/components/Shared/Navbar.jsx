import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const NavLink = ({ to, children, onClick }) => (
  <Link to={to} onClick={onClick} className="block py-2 px-4 text-gray-300 hover:text-green-500 transition-colors">
    {children}
  </Link>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const closeMenu = () => setIsOpen(false);

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
        <Link to="/" onClick={closeMenu} className="font-bold text-2xl text-white tracking-wider">
          Rescue<span className="text-green-500">Bites</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-white">
          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              {user.role === 'consumer' && (
                <>
                  <NavLink to="/available-food">Available Food</NavLink>
                  <NavLink to="/my-bookings">My Bookings</NavLink>
                </>
              )}
              {user.role === 'provider' && (
                <>
                  <NavLink to="/post-food">Post Food</NavLink>
                  <NavLink to="/my-posts">My Posts</NavLink>
                  <NavLink to="/booking-history">History</NavLink>
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
              <Link to="/login" className="px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">Login</Link>
              <Link to="/signup" className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-semibold">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger Icon */}
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-gray-800 shadow-lg"
          >
            <div className="flex flex-col px-4 py-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 p-4 border-b border-gray-700">
                    <FaUserCircle className="text-2xl text-gray-300" />
                    <span className="font-medium text-white">{user.name}</span>
                  </div>
                  <NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink>
                  {user.role === 'consumer' && (
                    <>
                      <NavLink to="/available-food" onClick={closeMenu}>Available Food</NavLink>
                      <NavLink to="/my-bookings" onClick={closeMenu}>My Bookings</NavLink>
                    </>
                  )}
                  {user.role === 'provider' && (
                    <>
                      <NavLink to="/post-food" onClick={closeMenu}>Post Food</NavLink>
                      <NavLink to="/my-posts" onClick={closeMenu}>My Posts</NavLink>
                      <NavLink to="/booking-history" onClick={closeMenu}>History</NavLink>
                    </>
                  )}
                  <button onClick={handleLogout} className="w-full text-left bg-red-600/20 text-red-400 my-2 mx-4 px-4 py-2 rounded-md hover:bg-red-600/40 transition-colors font-semibold">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
                  <NavLink to="/signup" onClick={closeMenu}>Sign Up</NavLink>
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