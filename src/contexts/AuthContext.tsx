import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, saveToken, clearToken, getUsername } from '@/lib/auth/storage'; // Import getUsername
import { login as apiLogin } from '@/lib/auth/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string } | null;
  login: (username: string, password: string) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Khởi tạo là false
  const [user, setUser] = useState<{ username: string } | null>(null);
  const navigate = useNavigate();

  // Khi component khởi tạo, kiểm tra token và cố gắng lấy thông tin user nếu có
  React.useEffect(() => {
    const token = getToken();
    const storedUsername = getUsername(); // Lấy tên người dùng từ storage
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUser({ username: storedUsername }); // Đặt user từ tên người dùng đã lưu
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []); // Mảng dependency rỗng để chỉ chạy một lần khi mount

  const login = async (username: string, password: string): Promise<string> => {
    try {
      const data = await apiLogin(username, password);
      saveToken(data.token, data.user_nicename); // Lưu tên người dùng cùng với token
      setIsAuthenticated(true);
      setUser({ username: data.user_nicename });
      return data.user_nicename;
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    clearToken();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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