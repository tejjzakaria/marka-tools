/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminAuthContextType {
  adminToken: string | null;
  isAuthenticated: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load token from sessionStorage on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem("adminToken");
    if (storedToken) {
      setAdminToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (pin: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        setAdminToken(data.token);
        setIsAuthenticated(true);
        sessionStorage.setItem("adminToken", data.token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setAdminToken(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminToken");
  };

  return (
    <AdminAuthContext.Provider value={{ adminToken, isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
