import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Giữ import ở đây
import { getToken, saveToken, clearToken } from '@/lib/auth/storage';
import { login as apiLogin, getCurrentUserInfo } from '@/lib/auth/api';

interface User {
  id: number; // Thêm trường id
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  description: string;
  nickname: string; // Thêm trường nickname
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<string>;
  logout: () => void;
  updateUserInfo: (newUser: User) => void; // Function to update user info in context
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate(); // Di chuyển useNaviage vào bên trong component AuthProvider

  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (token) {
      try {
        const userInfo = await getCurrentUserInfo();
        setUser({ 
          id: userInfo.id, // Lưu id người dùng
          username: userInfo.username, 
          email: userInfo.email,
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          description: userInfo.description,
          nickname: userInfo.nickname, // Lưu nickname
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
      await fetchUser(); // Fetch user info after successful login
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
    navigate('/login'); // Gọi navigate ở đây là an toàn vì nó nằm trong một hàm callback
  };

  const updateUserInfo = (newUser: User) => {
    setUser(newUser);
    // Also update the username in storage if it has changed
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