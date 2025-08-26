import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, saveToken, clearToken } from '@/lib/auth/storage';
import { login as apiLogin } from '@/lib/auth/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string } | null; // Thêm thông tin người dùng vào context
  login: (username: string, password: string) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());
  const [user, setUser] = useState<{ username: string } | null>(null); // State để lưu thông tin người dùng
  const navigate = useNavigate();

  // Khi component khởi tạo, kiểm tra token và cố gắng lấy thông tin user nếu có
  React.useEffect(() => {
    const token = getToken();
    if (token) {
      // Trong một ứng dụng thực tế, bạn sẽ cần một API endpoint để xác thực token
      // và lấy thông tin người dùng. Ở đây, chúng ta sẽ giả định có thể lấy username
      // từ một nguồn nào đó hoặc lưu trữ nó cùng với token.
      // Hiện tại, chúng ta sẽ không có username sau khi refresh nếu không có API.
      // Để đơn giản, chúng ta sẽ chỉ set isAuthenticated.
      // Nếu muốn username persistent, cần lưu nó vào localStorage hoặc gọi API.
      setIsAuthenticated(true);
      // Giả định username có thể được lấy từ token hoặc một nơi khác
      // For now, we'll leave user as null or fetch it if an API exists.
      // For this example, we'll rely on the login function to set it.
    }
  }, []);

  const login = async (username: string, password: string): Promise<string> => {
    try {
      const data = await apiLogin(username, password);
      saveToken(data.token);
      setIsAuthenticated(true);
      setUser({ username: data.user_nicename }); // Lưu tên người dùng vào state
      return data.user_nicename;
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      setUser(null); // Xóa thông tin người dùng nếu đăng nhập thất bại
      throw error;
    }
  };

  const logout = () => {
    clearToken();
    setIsAuthenticated(false);
    setUser(null); // Xóa thông tin người dùng khi đăng xuất
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