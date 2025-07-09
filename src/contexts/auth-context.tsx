"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import type { SubscriptionPlan, User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  subscribe: (plan: SubscriptionPlan) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status, update } = useSession();
  const [appUser, setAppUser] = useState<User | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setAppUser(session.user);
    } else if (status === 'unauthenticated') {
      setAppUser(null);
    }
  }, [session, status]);
  
  const loading = status === 'loading';

  const login = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const logout = () => {
    setAppUser(null);
    signOut({ callbackUrl: '/' });
  };

  const subscribe = async (plan: SubscriptionPlan) => {
    if (!appUser) return;

    // Optimistically update local state for immediate UI feedback.
    const updatedUser: User = {
      ...appUser,
      plan: plan,
      usage: {
        ...appUser.usage,
        maxRequests: plan.quota,
      },
    };
    setAppUser(updatedUser);
    
    // Call API to persist change in the database.
    await fetch('/api/user/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id }),
    });

    // Trigger a session update to refetch the session from the server.
    await update();
  };
  
  const value = { user: appUser, loading, login, logout, subscribe };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
