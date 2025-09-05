import axios from 'axios';
import { getToken, saveToken, clearToken, getUser } from "./storage";
import { User, LoginCredentials, ApiResponse, UserProfileData, UpdateProfilePayload } from '@/types';

export const WP_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://naviu-backend.ezd.vn";

// Create an Axios instance with default headers and base URL
export const axiosInstance = axios.create({ // Export axiosInstance
  baseURL: WP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the authentication token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Login Function ---
export async function login(credentials: LoginCredentials): Promise<ApiResponse<{user: User, token: string}>> {
  try {
    const response = await axiosInstance.post('/wp-json/jwt-auth/v1/token', {
      username: credentials.username,
      password: credentials.password
    });
    
    const data = response.data;
    const { token, user_id, user_email, user_nicename, user_display_name } = data;
    
    if (!token) {
      return {
        success: false,
        message: 'No token received from server'
      };
    }
    
    const user: User = {
      id: user_id || 0,
      user_login: user_nicename,
      user_nicename: user_nicename,
      user_display_name: user_display_name,
      username: user_nicename,
      email: user_email,
    };

    saveToken(token, user);
    
    return {
      success: true,
      data: {
        token,
        user
      }
    };
    
  } catch (error: any) {
    console.error('❌ Login error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Login failed. Please try again.'
    };
  }
}

export async function register(username: string, email: string, password: string) {
  try {
    const res = await axiosInstance.post('/wp-json/custom/v1/register', { username, email, password });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Đăng ký không thành công.");
  }
}

export async function getCurrentUserInfo(): Promise<User> {
  try {
    const res = await axiosInstance.get('/wp-json/wp/v2/users/me?context=edit');
    const wpUser = res.data;

    const user: User = {
      id: wpUser.id,
      username: wpUser.slug,
      email: wpUser.email,
      first_name: wpUser.first_name,
      last_name: wpUser.last_name,
      description: wpUser.description,
      nickname: wpUser.nickname || wpUser.slug,
      user_login: wpUser.slug,
      user_nicename: wpUser.slug,
      user_display_name: wpUser.name,
    };
    return user;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch user info.");
  }
}

export async function getUserProfile(): Promise<ApiResponse<UserProfileData>> {
  try {
    const response = await axiosInstance.get('/wp-json/users/v1/profile');
    // Assuming the backend returns { success: true, data: UserProfileData }
    return { success: true, data: response.data.data }; 
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'An unknown error occurred while fetching user profile.',
    };
  }
}

export async function updateUserProfile(profileData: UpdateProfilePayload): Promise<ApiResponse<any>> {
  try {
    const response = await axiosInstance.put('/wp-json/users/v1/profile', profileData);
    // Assuming the backend returns { success: true, message: "..." }
    return { success: true, data: response.data, message: response.data.message || 'Cập nhật thành công!' };
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return { success: false, message: error.response?.data?.message || error.message || 'An unknown error occurred.' };
  }
}

export async function getTestHistory() {
  try {
    const res = await axiosInstance.get('/wp-json/naviu/v1/history');
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Không thể tải lịch sử bài test.");
  }
}