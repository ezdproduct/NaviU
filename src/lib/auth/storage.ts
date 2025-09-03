import { User } from '@/types'; // Import User interface từ file kiểu dữ liệu chung

const AUTH_TOKEN_KEY = "jwt_token"; // Changed from "auth_token"
const USER_KEY = "user";

export function saveToken(token: string, user: User) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() { // Đảm bảo hàm này được export
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getUser(): User | null {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

export function clearToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}