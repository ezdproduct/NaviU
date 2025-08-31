import { getToken } from "./storage";

const WP_BASE_URL = "https://naviu-backend.ezd.vn";

// Enhanced authenticatedFetch với debug
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  
  console.log('🔍 API Request Debug:', {
    url,
    method: options.method || 'GET',
    hasToken: !!token,
    token: token ? `${token.substring(0, 20)}...` : 'No token'
  });
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const finalOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  console.log('📤 Final request options:', finalOptions);
  
  try {
    const response = await fetch(url, finalOptions);
    
    console.log('📥 Response status:', response.status);
    
    // Clone response để đọc body mà không consume
    const responseClone = response.clone();
    const responseText = await responseClone.text();
    console.log('📄 Response body:', responseText);
    
    return response;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    throw error;
  }
}

export async function login(username: string, password: string) {
  const res = await authenticatedFetch(`${WP_BASE_URL}/wp-json/jwt-auth/v1/token`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json(); 
}

export async function register(username: string, email: string, password: string) {
  const res = await authenticatedFetch(`${WP_BASE_URL}/wp-json/custom/v1/register`, {
    method: "POST",
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

  const res = await authenticatedFetch(`${WP_BASE_URL}/wp-json/custom/v1/user/me`, {
    method: "GET",
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

  const res = await authenticatedFetch(`${WP_BASE_URL}/wp-json/wp/v2/users/${userId}`, {
    method: "PUT", // Thay đổi phương thức thành PUT
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update user info.");
  }
  return res.json();
}

// Test function để debug
export async function testConnection(): Promise<any> {
  const API_BASE_URL = WP_BASE_URL; // Sử dụng WP_BASE_URL đã định nghĩa
  
  console.log('🔗 Testing connection to:', API_BASE_URL);
  
  try {
    // Test basic WordPress API
    const basicResponse = await fetch(`${API_BASE_URL}/wp/v2/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Basic API response:', basicResponse.status);
    
    // Test with authentication
    const token = getToken();
    if (token) {
      const authResponse = await authenticatedFetch(`${API_BASE_URL}/wp/v2/users/me`);
      console.log('Auth API response:', authResponse.status);
      
      const authData = await authResponse.json();
      console.log('Auth API data:', authData);
    }
    
    // Test debug endpoint
    const debugResponse = await authenticatedFetch(`${API_BASE_URL}/debug/v1/test-post`, {
      method: 'POST',
      body: JSON.stringify({
        test: 'data',
        timestamp: new Date().toISOString()
      })
    });
    
    const debugData = await debugResponse.json();
    console.log('Debug endpoint response:', debugData);
    
    return { success: true };
    
  } catch (error) {
    console.error('Connection test failed:', error);
    return { success: false, error };
  }
}