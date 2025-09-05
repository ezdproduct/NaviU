// src/types/index.ts

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  description?: string;
  nickname?: string;
  user_login: string;
  user_nicename: string;
  user_display_name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface UserProfileData {
  id: number;
  username: string;
  email: string;
  display_name: string;
  first_name: string;
  last_name: string;
  description: string;
  avatar: string;
  meta: {
    phone: string;
    birthday: string;
    total_tests_taken: number;
    average_score: number;
    registration_date: string;
  };
}

export interface UpdateProfilePayload {
  display_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  description?: string;
  phone?: string;
  birthday?: string;
}