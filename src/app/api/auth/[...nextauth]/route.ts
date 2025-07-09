'use server';

import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PLANS } from '@/lib/constants';
import type { User } from '@/lib/types';

// In a real app, this would be a database adapter.
// We use a simple in-memory object to simulate a database.
// This object will reset on every server restart.
const userDatabase: Record<string, Pick<User, 'id' | 'plan' | 'usage'>> = {};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub && token.email) {
        // Find or create the user in our mock database
        if (!userDatabase[token.email]) {
          userDatabase[token.email] = {
            id: token.sub,
            plan: PLANS[0], // Default to free plan
            usage: {
              requests: 0,
              maxRequests: PLANS[0].quota,
            },
          };
        }
        
        const appData = userDatabase[token.email];
        
        // Merge the OAuth user data with our app-specific data
        session.user = {
          name: token.name || '',
          email: token.email,
          image: token.picture,
          ...appData, 
        };
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
