import httpClient from './http';
import { API_ENDPOINTS } from '../utils/constants';

interface UserProfileData {
  id: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  description?: string;
  nickname?: string;
  // Thêm các trường khác nếu cần
}

class UsersAPI {
  
  async getProfile(userId: number) {
    try {
      // Sử dụng WP REST API tiêu chuẩn để lấy thông tin người dùng theo ID
      const response = await httpClient.get(`${API_ENDPOINTS.WP_USERS}/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get profile'
      };
    }
  }
  
  async updateProfile(userId: number, profileData: Partial<UserProfileData>) {
    try {
      const response = await httpClient.put(`${API_ENDPOINTS.WP_USERS}/${userId}`, profileData);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    }
  }
  
  // getTestHistory hiện không được triển khai trong dự án, nên tôi sẽ bỏ qua nó.
  // async getTestHistory(params = {}) { ... }
}

export default new UsersAPI();