import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PLANS } from '@/lib/constants';
import type { User } from '@/lib/types';

// In a real app, this would be a database adapter.
// We use a simple in-memory object to simulate a database.
// This object will reset on every server restart.
const userDatabase: Record<string, Pick<User, 'id' | 'plan' | 'usage'>> = {};

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const nextAuthUrl = process.env.NEXTAUTH_URL;

// We're throwing an error here to prevent the app from starting if the
// environment variables are not set. This is a good practice for
// critical variables that are required for the app to function correctly.
if (!googleClientId || !googleClientSecret) {
  throw new Error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET. Please set them in your .env.local file.');
}

if (!nextAuthSecret) {
    throw new Error('Missing NEXTAUTH_SECRET. Please set it in your .env.local file.');
}

if (!nextAuthUrl) {
    throw new Error('Missing NEXTAUTH_URL. Please set it in your .env.local file. For local development, it should be http://localhost:9002');
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
