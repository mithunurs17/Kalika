"use client";

import { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  class: string;
  points: number;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, studentClass: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage in this example)
    const storedUser = localStorage.getItem("kalika_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call to your backend
      // For demo purposes, we'll simulate a successful login
      const mockUser = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        name: email.split("@")[0],
        email,
        class: "10th", // Default class
        points: 0,
      };
      
      // Store user in localStorage
      localStorage.setItem("kalika_user", JSON.stringify(mockUser));
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    studentClass: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call to your backend
      // For demo purposes, we'll simulate a successful registration
      const mockUser = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        name,
        email,
        class: studentClass,
        points: 0,
      };
      
      // Store user in localStorage
      localStorage.setItem("kalika_user", JSON.stringify(mockUser));
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("kalika_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};