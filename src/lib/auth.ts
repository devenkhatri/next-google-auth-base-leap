import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PLANS } from '@/lib/constants';
import type { User, SubscriptionPlan } from '@/lib/types';

// In a real app, this would be a database adapter.
// We use a simple in-memory object to simulate a database.
// This object will reset on every server restart.
const userDatabase: Record<string, Pick<User, 'id' | 'plan' | 'usage'>> = {};

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET. Please set them in your .env.local file.');
}

if (!nextAuthSecret) {
    throw new Error('Missing NEXTAUTH_SECRET. Please set it in your .env.local file.');
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  secret: nextAuthSecret,
  callbacks: {
    async jwt({ token, user, account }) {
      // On initial sign-in, user and account objects are available.
      if (account && user && user.email) {
        // Find or create the user in our mock database
        if (!userDatabase[user.email]) {
          userDatabase[user.email] = {
            id: user.id, // This is the 'sub' from Google
            plan: PLANS[0], // Default to free plan
            usage: {
              requests: 0,
              maxRequests: PLANS[0].quota,
            },
          };
        }
        const appData = userDatabase[user.email];

        // Add our custom fields to the token
        token.id = appData.id;
        token.plan = appData.plan;
        token.usage = appData.usage;
      }
      return token;
    },

    async session({ session, token }) {
      // Add our custom fields from the token to the session
      if (token && session.user) {
        session.user.id = token.id;
        session.user.plan = token.plan;
        session.user.usage = token.usage;
      }
      return session;
    },
  },
};
