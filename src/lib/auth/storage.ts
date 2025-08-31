const TOKEN_KEY = "jwt_token"; // Đã đổi từ wp_jwt
const USER_DATA_KEY = "user"; // Đã đổi từ wp_username

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function saveUser(user: any) { // Lưu toàn bộ đối tượng người dùng
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() { // Lấy toàn bộ đối tượng người dùng
  const userStr = localStorage.getItem(USER_DATA_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY); // Xóa dữ liệu người dùng
}