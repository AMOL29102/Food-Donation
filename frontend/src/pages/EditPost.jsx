import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostByIdRequest, updatePostRequest } from '../api/providerApi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaUtensils, FaFileAlt, FaBox, FaClock } from 'react-icons/fa';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    expiresInHours: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await getPostByIdRequest(id);
        setFormData({
          title: data.title,
          description: data.description,
          quantity: data.quantity,
          expiresInHours: '' // User must enter a new duration if they want to extend it
        });
      } catch (error) {
        toast.error('Failed to fetch post data.');
        navigate('/my-posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePostRequest(id, formData);
      toast.success('Post updated successfully!');
      navigate('/my-posts');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update post.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Edit <span className="text-green-500">Food Post</span></h1>
        {/* **FIX: Added the complete form structure** */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <div className="relative"><FaUtensils className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md" /></div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <div className="relative"><FaFileAlt className="absolute left-3 top-4 text-gray-400" /><textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md"></textarea></div>
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-2">Quantity (servings)</label>
            <div className="relative"><FaBox className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} required min="1" className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md" /></div>
          </div>
          <div>
            <label htmlFor="expiresInHours" className="block text-sm font-medium text-gray-300 mb-2">Extend Expiration For (Hours)</label>
            <div className="relative"><FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="number" name="expiresInHours" id="expiresInHours" value={formData.expiresInHours} onChange={handleChange} min="1" placeholder="Leave blank to keep original time" className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-md" /></div>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md">Update Post</motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default EditPost;