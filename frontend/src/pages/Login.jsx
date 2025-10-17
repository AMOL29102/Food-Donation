import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    identifier: '',
    password: '',
    role: 'consumer'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // The login function returns the full response data, including the user object
      const { user } = await login(form); 
      toast.success('Login successful!');

      // ** FIX: Conditional redirection based on user role **
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login handleSubmit caught an error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Check console for details.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-screen px-4"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-white">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email/Mobile Input */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="identifier"
              placeholder="Email or Mobile"
              value={form.identifier}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Role Selection */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'consumer' })}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                form.role === 'consumer'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Consumer
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'provider' })}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                form.role === 'provider'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Provider
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'admin' })}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                form.role === 'admin'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Admin
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700"
          >
            Login
          </motion.button>
        </form>

        <p className="text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-green-500 hover:text-green-400">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;