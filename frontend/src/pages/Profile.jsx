import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfileRequest, updateProfileRequest } from '../api/userApi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, setUser } = useAuth(); // Get setUser from context
  const [formData, setFormData] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setFormData({ ...user });
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateProfileRequest(formData);
      setUser(data); // Update user in context
      localStorage.setItem('user', JSON.stringify(data)); // Update localStorage
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">My <span className="text-green-500">Profile</span></h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display/Edit Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className="mt-1 w-full p-3 bg-gray-700 border border-gray-600 rounded-md disabled:opacity-70" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} className="mt-1 w-full p-3 bg-gray-700 border border-gray-600 rounded-md disabled:opacity-70" />
          </div>
          {/* Add other fields like mobile, address, pincode similarly */}
          
          {isEditing ? (
            <div className="flex gap-4">
              <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
            </div>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Edit Profile</button>
          )}
        </form>
      </div>
    </motion.div>
  );
};

export default Profile;