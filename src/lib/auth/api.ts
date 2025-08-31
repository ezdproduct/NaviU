import { getToken, saveToken, clearToken, getUser } from "./storage";
import { User, LoginCredentials, ApiResponse, UserProfileData, UpdateProfilePayload } from '@/types'; // Import from shared types

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
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  
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

// --- Updated Login Function ---
export async function login(credentials: LoginCredentials): Promise<ApiResponse<{user: User, token: string}>> {
  try {
    const API_BASE_URL = WP_BASE_URL;
    console.log('🔗 Login API URL:', `${API_BASE_URL}/wp-json/jwt-auth/v1/token`);
    
    const response = await fetch(`${API_BASE_URL}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password
      })
    });
    
    console.log('📥 Login response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Login error response:', errorText);
      
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
    console.log('📄 Login success data:', data);
    // Add this after line 141 to see what data structure we get
    console.log('JWT Token:', data.token);
    console.log('User Email:', data.user_email);
    console.log('User Nicename:', data.user_nicename);
    console.log('User Display Name:', data.user_display_name);
    console.log('User ID:', data.user_id);
    
    const { token, user_id, user_email, user_nicename, user_display_name } = data;
    
    if (!token) {
      return {
        success: false,
        message: 'No token received from server'
      };
    }
    
    const user: User = { // Changed to User
      id: user_id || 0,
      user_login: user_nicename,
      user_email: user_email,
      user_nicename: user_nicename,
      user_display_name: user_display_name,
      username: user_nicename, // Add username field
      email: user_email, // Add email field
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

/**
 * Fetches the current logged-in user's information.
 */
export async function getCurrentUserInfo(): Promise<User> { // Changed return type to User
  const token = getToken();
  const storedUser = getUser();
  if (!token || !storedUser) {
    throw new Error("No authentication token or user info found.");
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
  userId: number,
  userData: {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    description?: string;
    nickname?: string;
  }
) {
  const token = getToken();
  if (!token) {
    throw new Error("No authentication token found.");
  }

  const res = await authenticatedFetch(`${WP_BASE_URL}/wp-json/wp/v2/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update user info.");
  }
  return res.json();
}

// --- New Profile API Functions ---
export async function getUserProfile(): Promise<ApiResponse<UserProfileData>> {
  try {
    const API_BASE_URL = WP_BASE_URL; // Use the already defined WP_BASE_URL

    // Try custom endpoint first
    let response = await authenticatedFetch(`${API_BASE_URL}/wp-json/users/v1/profile`);
    
    // If custom endpoint not found (or returns an error indicating it's not there), use WordPress built-in
    if (!response.ok && response.status === 404) { // Check for 404 specifically
      console.log('⚠️ Custom profile endpoint not found, using WordPress built-in /wp/v2/users/me');
      response = await authenticatedFetch(`${API_BASE_URL}/wp-json/wp/v2/users/me`);
      
      if (!response.ok) {
        const errorData = await safeJsonParse(response); // Try to parse error response
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch user from built-in endpoint.`);
      }
      
      const wpUser = await safeJsonParse(response); // Use safeJsonParse for consistency
      
      // Transform WordPress user format to our UserProfileData format
      return {
        success: true,
        data: {
          id: wpUser.id,
          username: wpUser.slug || wpUser.username, // Use slug or username (user_login)
          email: wpUser.email,
          display_name: wpUser.name, // 'name' is display_name in WP REST API
          first_name: wpUser.first_name || '',
          last_name: wpUser.last_name || '',
          description: wpUser.description || '',
          avatar: wpUser.avatar_urls?.[96] || '', // Get 96x96 avatar URL
          meta: {
            phone: '', // Default empty, as standard WP /users/me doesn't provide this directly
            birthday: '', // Default empty
          }
        }
      };
    } else if (!response.ok) {
        // Handle other errors from the custom endpoint
        const errorData = await safeJsonParse(response);
        return { success: false, message: errorData.message || 'Failed to fetch user profile from custom endpoint.' };
    }
    
    // If custom endpoint was successful
    const data = await safeJsonParse(response);
    
    // The custom endpoint is expected to return { success: true, data: UserProfileData }
    // So we directly return data.data
    return {
      success: true,
      data: data.data // Assuming data.data is already UserProfileData
    };
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred while fetching user profile.'
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
    
    return { success: true, message: data.message || 'Profile updated successfully.' };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}


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