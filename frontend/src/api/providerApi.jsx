// src/api/providerApi.js
import API from "./axiosInstance";

// Create a new food post (Provider only)
export const postFoodRequest = async (foodData) => {
  const { data } = await API.post("/provider/post", foodData);
  return data;
};

// Fetch Provider's own posts
export const getProviderPosts = async () => {
  const { data } = await API.get("/provider/myposts");
  return data;
};

// Fetch Provider's booking history
export const getBookingHistoryRequest = async () => {
  const { data } = await API.get("/provider/history");
  return data;
};

// Delete a specific food post (Provider)
export const deleteFoodRequest = async (id) => {
  const { data } = await API.delete(`/provider/${id}`);
  return data;
};