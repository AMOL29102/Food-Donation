// src/api/consumerApi.js
import API from "./axiosInstance";

// Fetch all available food posts for consumers
export const getAvailableFood = async () => {
  // The endpoint to get available food is under the provider routes on the backend
  const { data } = await API.get("/consumer/available-food");
  return data;
};


// Book a food item with a specific quantity
export const bookFoodRequest = async (foodId, quantity) => {
  const { data } = await API.post(`/consumer/book/${foodId}`, { quantity });
  return data;
};

// Fetch all bookings for the current user
export const getConsumerBookings = async () => {
  const { data } = await API.get("/consumer/bookings");
  return data;
};

export const cancelBookingRequest = async (bookingId) => {
  const { data } = await API.delete(`/consumer/cancel/${bookingId}`);
  return data;
};