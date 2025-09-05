import { getToken, saveToken, clearToken, getUser } from "./storage";
import { User, LoginCredentials, ApiResponse, UserProfileData, UpdateProfilePayload } from '@/types';

export const WP_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://naviu-backend.ezd.vn";

// Safe JSON parser
export async function safeJsonParse(response: Response): Promise<any> {
  try {
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Expected JSON but got:', contentType);
      console.error('Response body:', text);
      
      throw new Error(`Expected JSON response but got ${contentType}. Check console for full response.`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('JSON Parse Error:', error);
    throw new Error('Failed to parse JSON response');
  }
}

// Enhanced authenticatedFetch
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  
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
  
  try {
    const response = await fetch(url, finalOptions);
    return response;
  } catch (error) {
    console.error('❌ Network error:', error);
    throw error;
  }
}

// --- Login Function ---
export async function login(credentials: LoginCredentials): Promise<ApiResponse<{user: User, token: string}>> {
  try {
    const response = await fetch(`${WP_BASE_URL}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: `HTTP ${response.status}: ${errorText}` };
      }
      return {
        success: false,
        message: errorData.message || `Login failed with status ${response.status}`
      };
    }
    
    const data = await safeJsonParse(response);
    const { token, user_id, user_email, user_nicename, user_display_name } = data;
    
    if (!token) {
      return {
        success: false,
        message: 'No token received from server'
      };
    }
    
    const user: User = {
      id: user_id || 0,
      user_login: user_nicename,
      user_nicename: user_nicename,
      user_display_name: user_display_name,
      username: user_nicename,
      email: user_email,
    };

    saveToken(token, user);
    
    return {
      success: true,
      data: {
        token,
        user
      }
    };
    
  } catch (error) {
    console.error('❌ Login error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Login failed. Please try again.'
    };
  }
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

export async function getCurrentUserInfo(): Promise<User> {
  const token = getToken();
  if (!token) {
    throw new Error("No authentication token found.");
  }

  const res = await authenticatedFetch(`${WP_BASE_URL}/wp-json/wp/v2/users/me?context=edit`, {
    method: "GET",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch user info.");
  }
  const wpUser = await res.json();

  const user: User = {
    id: wpUser.id,
    username: wpUser.slug,
    email: wpUser.email,
    first_name: wpUser.first_name,
    last_name: wpUser.last_name,
    description: wpUser.description,
    nickname: wpUser.nickname || wpUser.slug,
    user_login: wpUser.slug,
    user_nicename: wpUser.slug,
    user_display_name: wpUser.name,
  };
  return user;
}

export async function getUserProfile(): Promise<ApiResponse<UserProfileData>> {
  try {
    const response = await authenticatedFetch(`${WP_BASE_URL}/wp-json/users/v1/profile`);
    
    if (!response.ok) {
      const errorData = await safeJsonParse(response);
      return { success: false, message: errorData.message || 'Failed to fetch user profile.' };
    }
    
    const data = await safeJsonParse(response);
    return { success: true, data: data.data };
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while fetching user profile.',
    };
  }
}

export async function updateUserProfile(profileData: UpdateProfilePayload): Promise<ApiResponse<any>> {
  try {
    const response = await authenticatedFetch(`${WP_BASE_URL}/wp-json/users/v1/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    const data = await safeJsonParse(response);
    
    if (!response.ok) {
      return { success: false, message: data.message || 'Failed to update user profile.' };
    }
    
    return { success: true, data, message: 'Cập nhật thành công!' };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}

export async function getTestHistory() {
  const res = await authenticatedFetch(`${WP_BASE_URL}/wp-json/naviu/v1/history`, {
    method: "GET",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Không thể tải lịch sử bài test.");
  }
  return res.json();
}