import httpClient from './http';
import { API_ENDPOINTS } from '../utils/constants';
import { saveToken, clearToken, saveUser, getUser, getToken } from '../lib/auth/storage'; // Import các hàm storage đã cập nhật

class AuthAPI {
  
  async login(username: string, password: string) {
    try {
      const response = await httpClient.post(API_ENDPOINTS.LOGIN, {
        username,
        password
      });
      
      const { token, user_email, user_nicename, user_display_name, user_id } = response.data; // Thêm user_id nếu có từ backend
      
      if (token) {
        const userData = {
          id: user_id, // Lưu ID người dùng
          email: user_email,
          username: user_nicename,
          display_name: user_display_name,
          // Thêm các thuộc tính người dùng khác nếu có từ phản hồi đăng nhập
        };
        saveToken(token);
        saveUser(userData); // Lưu đối tượng người dùng
        
        return {
          success: true,
          token,
          user: userData
        };
      }
      
      throw new Error('Invalid response format');
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  }
  
  async register(username: string, email: string, password: string, role: string = 'subscriber') {
    try {
      const response = await httpClient.post(API_ENDPOINTS.REGISTER, {
        username,
        email,
        password,
        role
      });
      
      return {
        success: true,
        data: response.data
      };
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  }
  
  async validateToken() {
    try {
      const response = await httpClient.post(API_ENDPOINTS.VALIDATE_TOKEN);
      return { success: response.data.success }; // Giả định response.data có trường 'success'
      
    } catch (error) {
      console.error('Token validation error:', error);
      return { success: false };
    }
  }
  
  logout() {
    clearToken();
    // Chuyển hướng sẽ được xử lý bởi interceptor hoặc component App.tsx
  }
  
  getCurrentUser() {
    return getUser(); // Lấy đối tượng người dùng từ storage
  }
  
  getToken() {
    return getToken();
  }
  
  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthAPI();