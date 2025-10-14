import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaUsers } from 'react-icons/fa';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'consumer' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(form);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Login failed. Please check your credentials and selected role.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen px-4"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-white">Login to Your Account</h2>
        
        {error && <p className="text-red-500 text-center bg-red-500/10 p-3 rounded-md">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Login as:</label>
            <div className="flex gap-4">
              <label className={`flex-1 p-3 text-center border rounded-md cursor-pointer transition-colors ${form.role === 'consumer' ? 'bg-green-600 border-green-500' : 'bg-gray-700 border-gray-600'}`}>
                <input type="radio" name="role" value="consumer" checked={form.role === 'consumer'} onChange={handleChange} className="hidden" />
                Consumer
              </label>
              <label className={`flex-1 p-3 text-center border rounded-md cursor-pointer transition-colors ${form.role === 'provider' ? 'bg-green-600 border-green-500' : 'bg-gray-700 border-gray-600'}`}>
                <input type="radio" name="role" value="provider" checked={form.role === 'provider'} onChange={handleChange} className="hidden" />
                Provider
              </label>
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 transition-colors duration-300">
            Login
          </motion.button>
        </form>
        <p className="text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-green-500 hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;