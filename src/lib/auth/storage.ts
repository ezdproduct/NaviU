const TOKEN_KEY = "wp_jwt";
const USERNAME_KEY = "wp_username"; // Khóa mới cho tên người dùng

export function saveToken(token: string, username: string) { // Thêm tham số username
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username); // Lưu tên người dùng
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsername() { // Hàm mới để lấy tên người dùng
  return localStorage.getItem(USERNAME_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY); // Xóa tên người dùng
}