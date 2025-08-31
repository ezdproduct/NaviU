import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { clearToken, getToken } from '../lib/auth/storage'; // Sử dụng các hàm storage hiện có

// Tạo instance axios
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - đính kèm token
httpClient.interceptors.request.use(
  (config) => {
    const token = getToken(); // Lấy token từ storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - xử lý lỗi
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Xóa token không hợp lệ và chuyển hướng đến trang đăng nhập
      clearToken(); // Xóa token từ storage
      window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;