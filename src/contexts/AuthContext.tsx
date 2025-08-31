import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { getToken, saveToken, clearToken, getUser } from '@/lib/auth/storage';
import { login as apiLogin, getCurrentUserInfo } from '@/lib/auth/api'; // Removed WordPressUser and LoginCredentials import
import { User, LoginCredentials } from '@/types'; // Import User and LoginCredentials from shared types

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<string>;
  logout: () => void;
  updateUserInfo: (newUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async () => {
    const token = getToken();
    const storedUser = getUser();
    if (token && storedUser) {
      try {
        const userInfo = await getCurrentUserInfo();
        setUser({ 
          id: userInfo.ID || storedUser.ID,
          username: userInfo.user_login || storedUser.user_login, 
          email: userInfo.user_email || storedUser.user_email,
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          description: userInfo.description,
          nickname: userInfo.user_nicename || storedUser.user_nicename,
          user_login: userInfo.user_login || storedUser.user_login,
          user_nicename: userInfo.user_nicename || storedUser.user_nicename,
          user_display_name: userInfo.user_display_name || storedUser.user_display_name,
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

  const login = async (credentials: LoginCredentials): Promise<string> => {
    try {
      const result = await apiLogin(credentials);
      if (result.success && result.data) {
        const { user: loggedInUser } = result.data;
        setUser({
          id: loggedInUser.ID,
          username: loggedInUser.user_login,
          email: loggedInUser.user_email,
          first_name: loggedInUser.first_name,
          last_name: loggedInUser.last_name,
          description: loggedInUser.description,
          nickname: loggedInUser.user_nicename,
          user_login: loggedInUser.user_login,
          user_nicename: loggedInUser.user_nicename,
          user_display_name: loggedInUser.user_display_name,
        });
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
        saveToken(token, {
          ID: newUser.id,
          user_login: newUser.username,
          user_email: newUser.email,
          user_nicename: newUser.nickname || newUser.username,
          user_display_name: newUser.first_name && newUser.last_name ? `${newUser.first_name} ${newUser.last_name}` : newUser.username,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          description: newUser.description,
          nickname: newUser.nickname,
        });
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