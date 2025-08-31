import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { getToken, saveToken, clearToken, getUser } from '@/lib/auth/storage'; // Import thêm getUser
import { login as apiLogin, getCurrentUserInfo, WordPressUser, LoginCredentials } from '@/lib/auth/api'; // Import WordPressUser và LoginCredentials

interface User { // Cập nhật giao diện User để khớp với WordPressUser và các trường bổ sung
  id: number;
  username: string;
  email: string;
  first_name?: string; // Make optional
  last_name?: string; // Make optional
  description?: string; // Make optional
  nickname?: string; // Make optional
  user_login: string;
  user_nicename: string;
  user_display_name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<string>; // Cập nhật kiểu tham số
  logout: () => void;
  updateUserInfo: (newUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async () => {
    const token = getToken();
    const storedUser = getUser(); // Lấy user từ storage
    if (token && storedUser) {
      try {
        // Gọi API để lấy thông tin user mới nhất, hoặc sử dụng storedUser nếu không cần cập nhật ngay
        const userInfo = await getCurrentUserInfo(); // Hàm này sẽ trả về thông tin user đầy đủ
        setUser({ 
          id: userInfo.id || storedUser.ID, // Ưu tiên ID từ API, fallback về storedUser
          username: userInfo.username || storedUser.user_login, 
          email: userInfo.email || storedUser.user_email,
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          description: userInfo.description,
          nickname: userInfo.nickname || storedUser.user_nicename, // Ưu tiên nickname từ API
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

  const login = async (credentials: LoginCredentials): Promise<string> => { // Cập nhật kiểu tham số
    try {
      const result = await apiLogin(credentials); // Gọi hàm login mới
      if (result.success && result.data) {
        const { token, user: loggedInUser } = result.data;
        // Cập nhật user trong context
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
        return loggedInUser.user_nicename; // Trả về user_nicename
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
        // Cập nhật thông tin user trong localStorage
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