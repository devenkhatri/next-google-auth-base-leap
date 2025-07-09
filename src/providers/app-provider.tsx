"use client";

import React from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { SessionProvider } from 'next-auth/react';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
