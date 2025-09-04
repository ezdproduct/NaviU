import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { getToken, saveToken, clearToken } from '@/lib/auth/storage';
import { login as apiLogin, getCurrentUserInfo } from '@/lib/auth/api';
import { User, LoginCredentials } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<string>;
  logout: () => void;
  updateUserInfo: (newUser: User) => void;
  isLoadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const fetchUser = useCallback(async () => {
    setIsLoadingAuth(true);
    // Đã xóa độ trễ nhân tạo
    // await new Promise(resolve => setTimeout(resolve, 1000)); 

    const token = getToken();
    if (token) {
      try {
        const userInfo = await getCurrentUserInfo();
        setUser(userInfo);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to fetch user on load, clearing token.", error);
        clearToken();
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoadingAuth(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials: LoginCredentials): Promise<string> => {
    try {
      const result = await apiLogin(credentials);
      if (result.success && result.data) {
        const { user: loggedInUser } = result.data;
        setUser(loggedInUser);
        setIsAuthenticated(true);
        return loggedInUser.user_nicename;
      } else {
        throw new Error(result.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      clearToken();
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    clearToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUserInfo = (newUser: User) => {
    setUser(newUser);
    const token = getToken();
    if (token && newUser) {
        saveToken(token, newUser);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUserInfo, isLoadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};