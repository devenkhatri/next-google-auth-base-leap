import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PLANS } from '@/lib/constants';
import type { User } from '@/lib/types';
import { db } from './firebase-admin';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const nextAuthUrl = process.env.NEXTAUTH_URL;

if (!googleClientId || !googleClientSecret) {
  throw new Error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET.');
}
if (!nextAuthSecret) {
    throw new Error('Missing NEXTAUTH_SECRET.');
}
if(!nextAuthUrl) {
    throw new Error('Missing NEXTAUTH_URL.');
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
      if (account && user && user.email && user.id) {
        const usersRef = db.collection('users');
        const userDoc = await usersRef.doc(user.id).get();
        
        let appData: Pick<User, 'id' | 'plan' | 'usage'>;

        if (!userDoc.exists) {
          // New user, create them in Firestore
          const freePlan = PLANS.find(p => p.id === 'free')!;
          const newUser: User = {
            id: user.id,
            name: user.name || 'New User',
            email: user.email,
            image: user.image || null,
            plan: freePlan,
            usage: {
              requests: 0,
              maxRequests: freePlan.quota,
            },
          };
          await usersRef.doc(user.id).set(newUser);
          appData = {
            id: newUser.id,
            plan: newUser.plan,
            usage: newUser.usage,
          };
        } else {
          // Existing user
          const existingUser = userDoc.data() as User;
          appData = {
            id: existingUser.id,
            plan: existingUser.plan,
            usage: existingUser.usage,
          };
        }

        token.id = appData.id;
        token.plan = appData.plan;
        token.usage = appData.usage;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.plan = token.plan;
        session.user.usage = token.usage;
      }
      return session;
    },
  },
};
