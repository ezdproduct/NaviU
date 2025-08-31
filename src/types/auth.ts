// src/types/auth.ts - Unified user types
export interface User {
  id: number;
  ID: number; // WordPress uses ID (uppercase)
  username: string;
  user_login?: string; // WordPress field
  email: string;
  user_email?: string; // WordPress field
  display_name: string;
  first_name?: string;
  last_name?: string;
  description?: string;
  roles?: string[];
  avatar?: string;
  meta?: {
    phone?: string;
    birthday?: string;
    mbti?: string;
    scores_json?: string;
    answers_json?: string;
    total_tests_taken?: number;
    average_score?: number;
    registration_date?: string;
  };
}

// For backward compatibility
export interface StoredUser extends User {}

// API Response types
export interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    user: User; // This user object might be slightly different from the full User interface
    user_email: string;
    user_nicename: string;
    user_display_name: string;
  };
  message?: string;
}

export interface ProfileResponse {
  success: boolean;
  data: User;
  message?: string;
}

// General API response for other operations
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}