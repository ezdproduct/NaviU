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
 * Updates the current logged-in user's information.
 */
export async function updateUser(
  username: string,
  email: string,
  new_password?: string,
  current_password?: string
) {
  const token = getToken();
  if (!token) {
    throw new Error("No authentication token found.");
  }

  const body: { [key: string]: string } = {
    username,
    email,
  };

  if (new_password) {
    body.new_password = new_password;
  }
  if (current_password) {
    body.current_password = current_password;
  }

  const res = await fetch(`${WP_BASE_URL}/wp-json/custom/v1/user/me`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update user info.");
  }
  return res.json();
}