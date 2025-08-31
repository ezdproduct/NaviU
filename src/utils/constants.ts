export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/jwt-auth/v1/token',
  REGISTER: '/custom/v1/register', // Giữ nguyên endpoint đăng ký tùy chỉnh hiện có
  VALIDATE_TOKEN: '/jwt-auth/v1/token/validate',
  
  // User endpoints  
  WP_USERS: '/wp/v2/users', // Sử dụng WP REST API tiêu chuẩn cho người dùng
  // TEST_HISTORY: '/users/v1/test-history', // Chưa triển khai, giữ để tham khảo
};

export const USER_ROLES = {
  ADMIN: 'administrator',
  TEACHER: 'author', 
  STUDENT: 'subscriber'
};