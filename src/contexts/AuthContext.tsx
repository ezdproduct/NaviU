import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User } from '@/types/auth'; // Import User type
import { getStoredUser, clearAuthData, loginUser, getUserProfile, updateUserProfile } from '@/lib/auth/api'; // Import new API functions

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean; // Add isAuthenticated
  login: (username: string, password: string) => Promise<boolean>; // Update signature
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>; // Update signature
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = user !== null; // Derive isAuthenticated from user state

  const refreshUser = useCallback(async () => {
    try {
      const freshUser = await getUserProfile();
      if (freshUser) {
        setUser(freshUser);
      } else {
        // If profile cannot be fetched, clear auth data
        clearAuthData();
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      clearAuthData();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
        // Attempt to refresh user data from server for the latest info
        await refreshUser();
      }
      setLoading(false);
    };

    initializeAuth();
  }, [refreshUser]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const loggedInUser = await loginUser(username, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      clearAuthData(); // Clear data on login failure
      setUser(null);
      return false;
    }
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) {
        console.error("Cannot update user: No user logged in.");
        return false;
      }
      const updatedUser = await updateUserProfile(userData);
      if (updatedUser) {
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update user failed:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated, // Provide isAuthenticated
      login, 
      logout, 
      updateUser, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};