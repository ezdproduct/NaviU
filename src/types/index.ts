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

// Interfaces for NaviU Test Results and History
export interface NaviuResultData {
  result?: { // This seems to be the major_group_name/code
    major_group_name: string;
    major_group_code: string;
  };
  mbti?: {
    result: string;
    scores: { [key: string]: number };
    clarity: { [key: string]: string };
    percent: { [key: string]: string };
  };
  eq?: {
    scores: { [key: string]: number };
    levels: { [key: string]: string };
  };
  cognitive?: {
    Logic: number;
    Ngôn_ngữ: number;
    Không_gian: number;
  };
  holland?: {
    R: number;
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
  };
  values?: { [key: string]: number };
}

export interface NaviuHistoryItem {
  id: string;
  title: string;
  submitted_at: string;
  mbti?: string; // These are summary strings for history view
  eq?: NaviuResultData['eq'] | string; // Allow object or string
  cog?: NaviuResultData['cognitive'] | string; // Allow object or string
  holland?: NaviuResultData['holland'] | string; // Allow object or string
  details?: NaviuResultData; // Full details for result page
}