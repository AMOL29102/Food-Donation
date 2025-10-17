import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaUtensils, FaClock, FaEdit, FaTrash } from 'react-icons/fa';
import { getMyPostsRequest, deletePostRequest } from '../api/providerApi';

const PostCard = ({ post, onEdit, onDelete }) => {
    const isExpired = new Date(post.expiresAt) < new Date();
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`h-full bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col ${isExpired ? 'opacity-60' : ''}`}
        >
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-white mb-3">{post.title}</h3>
                    {isExpired && (
                        <span className="bg-red-500/20 text-red-400 text-xs font-semibold px-2 py-1 rounded-full">
                            Expired
                        </span>
                    )}
                </div>
                <p className="text-gray-400 mb-4 flex-grow">{post.description}</p>
                <div className="space-y-2 text-gray-300 border-t border-gray-700 pt-4">
                    <div className="flex items-center gap-2">
                        <FaUtensils className="text-green-500" />
                        <span>Quantity Remaining: {post.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaClock className="text-green-500" />
                        <span>Expires: {new Date(post.expiresAt).toLocaleString()}</span>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-gray-800/50 border-t border-gray-700 flex gap-4">
                <button onClick={onEdit} disabled={isExpired} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed">
                    <FaEdit /> Edit
                </button>
                <button onClick={onDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2">
                    <FaTrash /> Delete
                </button>
            </div>
        </motion.div>
    );
};


const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getMyPostsRequest();
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
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePostRequest(id);
        setPosts(posts?.filter(p => p._id !== id));
        toast.success("Post deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete post.");
      }
    }
  };

  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 sm:px-6 py-12"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
        My <span className="text-green-500">Posts</span>
      </h1>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          <AnimatePresence>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={() => handleDelete(post._id)} onEdit={() => handleEdit(post._id)} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-center text-gray-400 text-xl mt-16">You haven't posted any food yet.</p>
      )}
    </motion.div>
  );
};

export default MyPosts;