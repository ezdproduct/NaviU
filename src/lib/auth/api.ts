import { getToken } from "./storage";

const WP_BASE_URL = "https://naviu-backend.ezd.vn";

export async function login(username: string, password: string) {
  const res = await fetch(`${WP_BASE_URL}/wp-json/jwt-auth/v1/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json(); 
}

export async function register(username: string, email: string, password: string) {
  const res = await fetch(`${WP_BASE_URL}/wp-json/custom/v1/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Đăng ký không thành công.");
  }
  return res.json();
}

/**
 * Fetches the current logged-in user's information.
 */
export async function getCurrentUserInfo() {
  const token = getToken();
  if (!token) {
    throw new Error("No authentication token found.");
  }

  const res = await fetch(`${WP_BASE_URL}/wp-json/custom/v1/user/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch user info.");
  }
  return res.json();
}

/**
 * Updates the current logged-in user's information using the standard WordPress REST API.
 * Does NOT handle password changes in this version.
 */
export async function updateUser(
  userId: number, // Thêm userId làm đối số
  userData: {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    description?: string;
    nickname?: string; // Thêm nickname
  }
) {
  const token = getToken();
  if (!token) {
    throw new Error("No authentication token found.");
  }

  const res = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/users/${userId}`, {
    method: "PUT", // Thay đổi phương thức thành PUT
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update user info.");
  }
  return res.json();
}