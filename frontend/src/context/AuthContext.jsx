import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser, signupUser } from "../api/authApi";
import API from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Load from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, [token]);

  // Signup
  const signup = async (formData) => {
    const data = await signupUser(formData);
    if (data?.user && data?.token) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    }
    return data;
  };

  // Login
  const login = async (formData) => {
    const data = await loginUser(formData);

    console.log("Backend Response:", data);

    if (!data?.user || !data?.token) {
      console.error("Invalid backend response — user or token missing.");
      throw new Error("Invalid response from server. Check backend output.");
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    return data;
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
  };

  const value = { user, token, login, logout, signup, loading, setUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
