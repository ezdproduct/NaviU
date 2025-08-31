const AUTH_TOKEN_KEY = "auth_token"; // Đổi tên khóa token
const USER_KEY = "user"; // Khóa mới cho đối tượng người dùng

interface StoredUser {
  ID: number;
  user_login: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
  first_name?: string;
  last_name?: string;
  description?: string;
  nickname?: string;
}

export function saveToken(token: string, user: StoredUser) { // Cập nhật để nhận đối tượng user
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user)); // Lưu đối tượng user dưới dạng JSON
}

export function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getUser(): StoredUser | null { // Hàm mới để lấy đối tượng người dùng
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

export function clearToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY); // Xóa cả thông tin người dùng
}