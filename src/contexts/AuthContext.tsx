import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
// Removed useNavigate import
import { getToken, saveToken, clearToken } from '@/lib/auth/storage';
import { login as apiLogin, getCurrentUserInfo } from '@/lib/auth/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  description: string;
  nickname: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<string>;
  logout: () => void;
  updateUserInfo: (newUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  // Removed const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (token) {
      try {
        const userInfo = await getCurrentUserInfo();
        setUser({ 
          id: userInfo.id,
          username: userInfo.username, 
          email: userInfo.email,
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          description: userInfo.description,
          nickname: userInfo.nickname,
        });
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
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (username: string, password: string): Promise<string> => {
    try {
      const data = await apiLogin(username, password);
      saveToken(data.token, data.user_nicename);
      await fetchUser();
      return data.user_nicename;
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
    // Navigation will now be handled by a component inside RouterProvider (e.g., App.tsx)
  };

  const updateUserInfo = (newUser: User) => {
    setUser(newUser);
    const token = getToken();
    if (token && newUser.username) {
        saveToken(token, newUser.username);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUserInfo }}>
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