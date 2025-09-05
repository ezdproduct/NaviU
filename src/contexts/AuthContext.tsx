import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { getToken, saveToken, clearToken } from '@/lib/auth/storage';
import { login as apiLogin, getCurrentUserInfo, axiosInstance, WP_BASE_URL } from '@/lib/auth/api'; // Import axiosInstance
import { User, LoginCredentials } from '@/types';
import { NaviuResultData } from '@/components/profile/NaviUTestPage';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<string>;
  logout: () => void;
  updateUserInfo: (newUser: User) => void;
  isLoadingAuth: boolean;
  naviuResult: NaviuResultData | null;
  isLoadingResult: boolean;
  setNaviuResult: (result: NaviuResultData) => void;
  refetchNaviuResult: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [naviuResult, setNaviuResult] = useState<NaviuResultData | null>(null);
  const [isLoadingResult, setIsLoadingResult] = useState(true);

  const fetchLatestNaviuResult = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoadingResult(false);
      return;
    }
    setIsLoadingResult(true);
    try {
      const response = await axiosInstance.get(`${WP_BASE_URL}/wp-json/naviu/v1/latest-result`); // Sử dụng axiosInstance
      if (response.status === 200) {
        const data = response.data;
        if (data && Object.keys(data).length > 0) {
          setNaviuResult(data);
        } else {
          setNaviuResult(null);
        }
      } else {
        setNaviuResult(null);
      }
    } catch (error) {
      console.error("Failed to fetch latest NaviU result:", error);
      setNaviuResult(null);
    } finally {
      setIsLoadingResult(false);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    setIsLoadingAuth(true);
    const token = getToken();
    if (token) {
      try {
        const userInfo = await getCurrentUserInfo();
        setUser(userInfo);
        setIsAuthenticated(true);
        await fetchLatestNaviuResult();
      } catch (error) {
        console.error("Failed to fetch user on load, clearing token.", error);
        clearToken();
        setIsAuthenticated(false);
        setUser(null);
        setIsLoadingResult(false);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoadingResult(false);
    }
    setIsLoadingAuth(false);
  }, [fetchLatestNaviuResult]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials: LoginCredentials): Promise<string> => {
    try {
      const result = await apiLogin(credentials);
      if (result.success && result.data) {
        const { user: loggedInUser } = result.data;
        setUser(loggedInUser);
        setIsAuthenticated(true);
        await fetchLatestNaviuResult(); // Fetch results after login
        return loggedInUser.user_nicename;
      } else {
        throw new Error(result.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      clearToken();
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    clearToken();
    setIsAuthenticated(false);
    setUser(null);
    setNaviuResult(null); // Clear results on logout
  };

  const updateUserInfo = (newUser: User) => {
    setUser(newUser);
    const token = getToken();
    if (token && newUser) {
        saveToken(token, newUser);
    }
  };

  const handleSetNaviuResult = (result: NaviuResultData) => {
    setNaviuResult(result);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      updateUserInfo, 
      isLoadingAuth,
      naviuResult,
      isLoadingResult,
      setNaviuResult: handleSetNaviuResult,
      refetchNaviuResult: fetchLatestNaviuResult
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};