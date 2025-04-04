import axios from "axios";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
const AuthContext = createContext();

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (loginData) => {
    try {
      const response = await api.post("/auth/login", loginData);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const token = response.data.token;
      localStorage.setItem("token", JSON.stringify(token));
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || error.message);
      throw error;
    }
  };

  const signup = async (data) => {
    try {
      const response = await api.post("/auth/register", data);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      const token = response.data.token;
      localStorage.setItem("token", JSON.stringify(token));
      return response.data;
    } catch (error) {
      console.error(
        "Signup failed:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || error.message);
      throw error;
    }
  };
  const getUserStats = async () => {
    const response = await api.get("/user/profile");
    localStorage.setItem("user", JSON.stringify(response.data.user));
    setUser(response.data.user);
    return response.data;
  };
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, getUserStats }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
