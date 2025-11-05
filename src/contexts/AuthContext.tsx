import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, AuthUser } from '@/types';
import { mockUsers } from '@/data/mockData';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('instagram_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        // Error checking auth - would handle with proper error state
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const createAuthUser = (baseUser: typeof mockUsers[0]): AuthUser => ({
    ...baseUser,
    emailVerified: true,
    phoneNumber: undefined,
    settings: {
      theme: 'light' as const,
      language: 'en',
      notifications: {
        likes: true,
        comments: true,
        follows: true,
        mentions: true,
        directMessages: true,
        liveVideos: true,
      },
      privacy: {
        private: false,
        showActivity: true,
        allowMessageRequests: true,
        allowTagging: true,
      },
    },
  });

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user by email
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        throw new Error('User not found. Please check your email or sign up.');
      }

      // In real app, verify password here
      if (password.length < 1) {
        throw new Error('Password is required');
      }

      const authUser = createAuthUser(foundUser);
      setUser(authUser);
      localStorage.setItem('instagram_user', JSON.stringify(authUser));
      
      toast.success(`Welcome back, ${authUser.displayName}!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    username: string,
    displayName: string
  ): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        throw new Error('Email already exists');
      }

      // Check if username already exists
      const existingUsername = mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
      if (existingUsername) {
        throw new Error('Username already taken');
      }

      // Validation
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (username.length < 3) {
        throw new Error('Username must be at least 3 characters');
      }

      // Create new user
      const newUser: AuthUser = createAuthUser({
        id: Date.now().toString(),
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        displayName,
        bio: '',
        profilePicture: '',
        website: '',
        verified: false,
        private: false,
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        createdAt: new Date(),
        lastSeen: new Date(),
        accountType: 'personal',
        twoFactorEnabled: false,
        closeFriends: [],
        restrictedUsers: [],
        mutedUsers: [],
        blockedUsers: [],
      });

      setUser(newUser);
      localStorage.setItem('instagram_user', JSON.stringify(newUser));
      
      toast.success(`Welcome to Instagram, ${newUser.displayName}!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      localStorage.removeItem('instagram_user');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>): Promise<void> => {
    if (!user) return;

    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('instagram_user', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if email exists
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!foundUser) {
        throw new Error('Email not found');
      }

      toast.success('Password reset email sent!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Reset failed';
      toast.error(message);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};