// src/api/authApi.js
import API from "./axiosInstance";

export const signupUser = async (userData) => {
  const { data } = await API.post("/auth/signup", userData);
  // Token and user data are now handled by AuthContext upon successful API call
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await API.post("/auth/login", credentials);
  // Token and user data are now handled by AuthContext upon successful API call
  return data;
};

export const logoutUser = () => {
  // This function can be used for a server-side logout call in the future.
  // Client-side token removal is handled by AuthContext.
  localStorage.removeItem("token");
};