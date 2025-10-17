import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaPhone, FaHome } from 'react-icons/fa';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: 'consumer',
    pincode: '',
    address: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (form.role === 'provider' && (!form.mobile || !form.address)) {
        setError('Mobile number and address are required for providers');
        return;
      }
      await signup(form);
      navigate('/login');
    } catch (error) {
      setError('Failed to create an account. The email might already be in use.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen px-4 py-8"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-white">Create an Account</h2>
        <p className="text-center text-gray-400">Join our community to make a difference</p>

        {error && <p className="text-red-500 text-center bg-red-500/10 p-3 rounded-md">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={handleChange}
              required={form.role === 'provider'}
              className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'consumer' })}
              className={`flex-1 py-2 px-4 rounded-md ${
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
              className={`flex-1 py-2 px-4 rounded-md ${
                form.role === 'provider'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Provider
            </button>
          </div>

          {form.role === 'provider' && (
            <div className="relative">
              <FaHome className="absolute left-3 top-3 text-gray-400" />
              <textarea
                name="address"
                placeholder="Complete Address"
                value={form.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </div>
          )}

          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" name="pincode" placeholder="Pin Code" value={form.pincode} onChange={handleChange} required className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 transition-colors duration-300"
          >
            Sign Up
          </motion.button>
        </form>
        <p className="text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-green-500 hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Signup;