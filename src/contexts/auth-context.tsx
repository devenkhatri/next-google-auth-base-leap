"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { SubscriptionPlan, User } from '@/lib/types';
import { PLANS } from '@/lib/constants';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  subscribe: (plan: SubscriptionPlan) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd check for a session here (e.g., from localStorage or a cookie)
    // For this mock, we'll just start with a logged-out state.
    setLoading(false);
  }, []);

  const login = () => {
    // Mock user data
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      plan: PLANS[0], // Default to free plan
      usage: {
        requests: 0,
        maxRequests: PLANS[0].quota,
      },
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const subscribe = (plan: SubscriptionPlan) => {
    if (user) {
      setUser({
        ...user,
        plan: plan,
        usage: {
          ...user.usage,
          maxRequests: plan.quota,
        },
      });
    }
  };
  
  const value = { user, loading, login, logout, subscribe };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
