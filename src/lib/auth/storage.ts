import { User } from '@/types'; // Import User interface từ file kiểu dữ liệu chung

const AUTH_TOKEN_KEY = "auth_token";
const USER_KEY = "user";

// StoredUser giờ đây sẽ là User từ src/types/index.ts
// Không cần định nghĩa lại interface StoredUser ở đây nữa

export function saveToken(token: string, user: User) { // Hàm saveToken giờ đây nhận trực tiếp đối tượng User
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getUser(): User | null { // Hàm getUser giờ đây trả về đối tượng User
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

export function clearToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}