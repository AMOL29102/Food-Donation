import API from './axiosInstance';

// Get all posts for the logged-in provider
export const getMyPostsRequest = () => API.get('/provider/posts');

// Create a new food post
export const createPostRequest = (postData) => API.post('/provider/posts', postData);

// Get a single post by its ID
export const getPostByIdRequest = (id) => API.get(`/provider/posts/${id}`);

// Update an existing post
export const updatePostRequest = (id, postData) => API.put(`/provider/posts/${id}`, postData);

// Delete a post
export const deletePostRequest = (id) => API.delete(`/provider/posts/${id}`);

// Get booking history for the provider
export const getBookingHistoryRequest = () => API.get('/provider/history');