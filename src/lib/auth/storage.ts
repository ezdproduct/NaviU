import { User } from '@/types/auth'; // Import User type

const AUTH_TOKEN_KEY = "authToken"; // Đổi tên khóa token
const USER_KEY = "user"; // Khóa mới cho đối tượng người dùng

export function setAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function storeUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user)); // Lưu đối tượng user dưới dạng JSON
}

export function getStoredUser(): User | null { // Hàm mới để lấy đối tượng người dùng
  const userJson = localStorage.getItem(USER_KEY);
  if (userJson) {
    const parsedUser = JSON.parse(userJson);
    // Ensure both id and ID fields exist for consistency
    return {
      ...parsedUser,
      id: parsedUser.id || parsedUser.ID,
      ID: parsedUser.ID || parsedUser.id,
      email: parsedUser.email || parsedUser.user_email,
      user_email: parsedUser.user_email || parsedUser.email,
    };
  }
  return null;
}

export function clearAuthData() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY); // Xóa cả thông tin người dùng
}