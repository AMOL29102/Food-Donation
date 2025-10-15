import React, { useEffect, useState } from 'react';
import { getProviderPosts, deleteFoodRequest } from '../api/providerApi';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaClock, FaUtensils } from 'react-icons/fa';

const getStatus = (post) => {
  if (new Date(post.expiresAt) < new Date()) {
    return { text: 'Expired', color: 'bg-red-500' };
  }
  if (post.quantity === 0) {
    return { text: 'Fully Booked', color: 'bg-blue-500' };
  }
  return { text: 'Active', color: 'bg-green-500' };
};

const PostCard = ({ post, onDelete }) => {
  const status = getStatus(post);
  return (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.4 }}
    className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between relative"
  >
    <div className={`absolute top-4 right-4 text-xs text-white font-bold px-2 py-1 rounded-full ${status.color}`}>
        {status.text}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">{post.title}</h3>
        <p className="text-gray-400 mb-4">{post.description}</p>
        <div className="space-y-2 text-gray-300 border-t border-gray-700 pt-4 mt-4">
          <div className="flex items-center gap-2"><FaUtensils className="text-green-500" /><span>Remaining / Total: {post.quantity} / {post.originalQuantity}</span></div>
          <div className="flex items-center gap-2"><FaClock className="text-green-500" /><span>Expires: {new Date(post.expiresAt).toLocaleString()}</span></div>
        </div>
      </div>
    <motion.button
      onClick={() => onDelete(post._id)}
      whileHover={{ scale: 1.05, backgroundColor: '#c53030' }}
      whileTap={{ scale: 0.95 }}
      className="w-full mt-6 bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
    >
      <FaTrash /> Delete Post
    </motion.button>
  </motion.div>
)};

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getProviderPosts();
        setPosts(data);
      } catch (error) {
        toast.error("Failed to fetch your posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteFoodRequest(id);
        toast.success('Post deleted successfully!');
        // Update state immediately for a better UX
        setPosts(posts.filter(p => p._id !== id));
      } catch (error) {
        toast.error('Failed to delete post.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
        My Food <span className="text-green-500">Posts</span>
      </h1>
      {posts.length > 0 ? (
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <p className="text-center text-gray-400 text-xl mt-16">You have not posted any food donations yet.</p>
      )}
    </motion.div>
  );
};

export default MyPosts;