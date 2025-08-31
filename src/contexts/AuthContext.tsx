import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import AuthAPI from '@/api/auth'; // Import mới
import UsersAPI from '@/api/users'; // Import mới
import { saveUser, getUser, clearToken } from '@/lib/auth/storage'; // Import đã cập nhật

interface User {
  id?: number; // ID có thể không có trong phản hồi đăng nhập ban đầu
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  description?: string;
  nickname?: string;
  display_name?: string; // Từ phản hồi đăng nhập
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean; // Thêm trạng thái loading
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>; // Cập nhật kiểu trả về
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>; // Thêm hàm register
  logout: () => void;
  updateUserInfo: (newUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Khởi tạo loading là true

  const initAuth = useCallback(async () => {
    setLoading(true);
    const token = AuthAPI.getToken();
    
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const validationResult = await AuthAPI.validateToken();
      if (validationResult.success) {
        const storedUser = AuthAPI.getCurrentUser(); // Lấy người dùng từ localStorage
        if (storedUser && storedUser.id) { // Đảm bảo người dùng có ID để lấy hồ sơ đầy đủ
          const profileResult = await UsersAPI.getProfile(storedUser.id);
          if (profileResult.success) {
            setUser(profileResult.data);
            setIsAuthenticated(true);
            saveUser(profileResult.data); // Cập nhật localStorage với hồ sơ đầy đủ
          } else {
            console.error("Failed to fetch user profile:", profileResult.message);
            AuthAPI.logout(); // Đăng xuất nếu lấy hồ sơ thất bại
          }
        } else if (storedUser) { // Nếu dữ liệu người dùng tồn tại nhưng không có ID
            // Sử dụng dữ liệu người dùng đã lưu nếu không có ID để gọi getProfile
            setUser(storedUser);
            setIsAuthenticated(true);
        } else {
            AuthAPI.logout(); // Không có dữ liệu người dùng trong storage
        }
      } else {
        AuthAPI.logout(); // Token không hợp lệ
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      AuthAPI.logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const result = await AuthAPI.login(username, password);
      if (result.success && result.user) {
        // Sau khi đăng nhập thành công, gọi lại initAuth để lấy hồ sơ đầy đủ và cập nhật trạng thái
        await initAuth(); 
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const result = await AuthAPI.register(username, email, password);
      return result;
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthAPI.logout(); // Hàm này sẽ xóa token và có thể kích hoạt chuyển hướng
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUserInfo = (updatedUser: User) => {
    setUser(updatedUser);
    saveUser(updatedUser); // Cập nhật dữ liệu người dùng trong localStorage
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    updateUserInfo,
  };

  return (
    <AuthContext.Provider value={value}>
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