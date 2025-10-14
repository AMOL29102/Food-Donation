import React, { createContext, useState, useEffect, useContext } from "react";
import { signupUser, loginUser, logoutUser } from "../api/authApi";
import axiosInstance from "../api/axiosInstance";

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On initial load, check localStorage for auth data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // Signup function
  const signup = async (formData) => {
    try {
      await signupUser(formData);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials); // Expects { user, token }
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setUser(data.user);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    logoutUser(); // This should handle any server-side logout logic
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const value = { user, loading, signup, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};