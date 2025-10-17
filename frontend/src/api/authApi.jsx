// src/api/authApi.js
import API from "./axiosInstance";

export const signupUser = async (userData) => {
  const { data } = await API.post("/auth/signup", userData);
  return data; // must include user + token
};

export const loginUser = async (credentials) => {
  const { data } = await API.post("/auth/login", credentials);
  return data; // must include user + token
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
