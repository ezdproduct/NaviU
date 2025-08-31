import { getAuthToken, setAuthToken, storeUser, clearAuthData } from "./storage";
import { User, LoginResponse, ProfileResponse, ApiResponse } from '@/types/auth'; // Import from shared types

export const WP_BASE_URL = "https://naviu-backend.ezd.vn";

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

// Enhanced authenticatedFetch với debug
export async function authenticatedFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const url = `${WP_BASE_URL}/wp-json${path}`; // Construct full URL
  
  console.log('🔍 API Request:', {
    url,
    method: options.method || 'GET',
    hasToken: !!token
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
  
  try {
    const response = await fetch(url, finalOptions);
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Check content type
    const contentType = response.headers.get('content-type');
    console.log('📄 Content-Type:', contentType);
    
    // Read response as text first to debug
    const responseClone = response.clone();
    const responseText = await responseClone.text();
    
    console.log('📄 Raw response:', responseText.substring(0, 500)); // First 500 chars
    
    // Check if it's actually JSON
    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ Expected JSON but got:', contentType);
      console.error('❌ Response body:', responseText);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Network error:', error);
    throw error;
  }
}

// --- Login Function ---
export const loginUser = async (username: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch(`${WP_BASE_URL}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await safeJsonParse(response);
      throw new Error(errorData.message || 'Login failed');
    }

    const data: LoginResponse = await safeJsonParse(response);
    
    if (data.success && data.data) {
      setAuthToken(data.data.token); // Store token
      
      // Transform WordPress user data to our User interface
      const user: User = {
        id: data.data.user.ID || data.data.user.id,
        ID: data.data.user.ID || data.data.user.id,
        username: data.data.user.username || data.data.user_nicename,
        user_login: data.data.user.user_login || data.data.user_nicename,
        email: data.data.user.email || data.data.user_email,
        user_email: data.data.user.user_email || data.data.user.email,
        display_name: data.data.user.display_name || data.data.user_display_name,
        first_name: data.data.user.first_name || '',
        last_name: data.data.user.last_name || '',
        description: data.data.user.description,
        roles: data.data.user.roles || [],
        avatar: data.data.user.avatar,
        meta: data.data.user.meta
      };
      
      storeUser(user); // Store user data
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export async function register(username: string, email: string, password: string) {
  const res = await authenticatedFetch('/custom/v1/register', {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const errorData = await safeJsonParse(res);
    throw new Error(errorData.message || "Đăng ký không thành công.");
  }
  return safeJsonParse(res);
}

// --- Profile API Functions ---
export const getUserProfile = async (): Promise<User | null> => {
  try {
    const response = await authenticatedFetch('/users/v1/profile');
    const data: ProfileResponse = await safeJsonParse(response);
    
    if (data.success && data.data) {
      // Ensure consistent field mapping
      const user: User = {
        ...data.data,
        id: data.data.id || data.data.ID,
        ID: data.data.ID || data.data.id,
        email: data.data.email || data.data.user_email,
        user_email: data.data.user_email || data.data.email,
      };
      
      storeUser(user);
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userData: Partial<User>): Promise<User | null> => {
  try {
    const response = await authenticatedFetch('/users/v1/profile', {
      method: 'PUT', // Changed back to PUT as per user's request
      body: JSON.stringify(userData),
    });

    const data: ProfileResponse = await safeJsonParse(response);
    
    if (data.success && data.data) {
      const user: User = {
        ...data.data,
        id: data.data.id || data.data.ID,
        ID: data.data.ID || data.data.id,
        email: data.data.email || data.data.user_email,
        user_email: data.data.user_email || data.data.email,
      };
      
      storeUser(user);
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Test function để debug
export async function testConnection(): Promise<any> {
  const API_BASE_URL = WP_BASE_URL;
  
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
    const token = getAuthToken();
    if (token) {
      const authResponse = await authenticatedFetch('/wp/v2/users/me');
      console.log('Auth API response:', authResponse.status);
      
      const authData = await safeJsonParse(authResponse);
      console.log('Auth API data:', authData);
    }
    
    // Test debug endpoint
    const debugResponse = await authenticatedFetch('/debug/v1/test-post', {
      method: 'POST',
      body: JSON.stringify({
        test: 'data',
        timestamp: new Date().toISOString()
      })
    });
    
    const debugData = await safeJsonParse(debugResponse);
    console.log('Debug endpoint response:', debugData);
    
    return { success: true };
    
  } catch (error) {
    console.error('Connection test failed:', error);
    return { success: false, error };
  }
}