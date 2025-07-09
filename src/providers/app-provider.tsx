"use client";

import React from 'react';
import { AuthProvider } from '@/contexts/auth-context';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
