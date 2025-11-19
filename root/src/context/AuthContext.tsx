"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import API from "@/lib/axios";

interface User {
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  adminLogin: () => Promise<{ success: boolean; message?: string }>;
  register: (username: string, password: string, email: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const authStatus = localStorage.getItem("isAuthenticated");

    if (!token || authStatus !== "true") {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await API.get("/user/current");
      if (response.data && response.data.username) {
        setUser({
          username: response.data.username,
          email: response.data.email,
          role: response.data.role || "USER",
        });
        setIsAuthenticated(true);
        localStorage.setItem("role", response.data.role || "USER");
      } else {
        throw new Error("Invalid user data");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await API.post("/login", { username, password });
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("isAuthenticated", "true");
        await checkAuth();
        return { success: true, message: response.data.message };
      }
      return { success: false, message: "Login failed" };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Please check your credentials.",
      };
    }
  };

  const adminLogin = async () => {
    // Hardcoded admin credentials - not exposed in UI
    // Username: ShopSwiftAdmin2024
    // Password: SecureAdmin@2024!
    try {
      const response = await API.post("/admin/login", {
        username: "ShopSwiftAdmin2024",
        password: "SecureAdmin@2024!",
      });
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", "ShopSwiftAdmin2024");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("role", "ADMIN");
        await checkAuth();
        return { success: true, message: response.data.message };
      }
      return { success: false, message: "Admin login failed" };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Admin login failed",
      };
    }
  };

  const register = async (username: string, password: string, email: string) => {
    try {
      const response = await API.post("/register", { username, password, email });
      if (response.data && response.data.message) {
        return { success: true, message: response.data.message };
      }
      return { success: false, message: "Registration failed" };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        adminLogin,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

