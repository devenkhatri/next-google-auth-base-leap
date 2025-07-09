"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';
import type { SubscriptionPlan, User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  subscribe: (plan: SubscriptionPlan) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  
  // We use a local state for the user object to allow for client-side updates
  // that provide immediate UI feedback (e.g., after subscribing to a new plan).
  const [appUser, setAppUser] = useState<User | null>(null);

  useEffect(() => {
    // When the session from NextAuth loads or changes, sync it to our local appUser state.
    if (status === 'authenticated' && session?.user) {
      // The session.user object is augmented by the [...nextauth] callback
      setAppUser(session.user);
    } else if (status === 'unauthenticated') {
      setAppUser(null);
    }
  }, [session, status]);
  
  const loading = status === 'loading';

  const logout = () => {
    // Clear local state and sign out from NextAuth
    setAppUser(null);
    signOut({ callbackUrl: '/' });
  };

  const subscribe = (plan: SubscriptionPlan) => {
    // This function provides a client-side update for immediate UI feedback.
    // In a real app, you would also make an API call to your backend to persist
    // this change in the database.
    if (appUser) {
      const updatedUser: User = {
        ...appUser,
        plan: plan,
        usage: {
          ...appUser.usage,
          maxRequests: plan.quota,
        },
      };
      setAppUser(updatedUser);
      // Note: This only updates the state in the browser. A page refresh
      // will revert to the plan stored in the server-side session.
    }
  };
  
  const value = { user: appUser, loading, logout, subscribe };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
