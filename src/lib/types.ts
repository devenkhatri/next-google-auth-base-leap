import type { DefaultSession } from "next-auth";
import type { JWT as NextAuthJWT } from "next-auth/jwt";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  price_id: string;
  currency: string;
  features: string[];
  quota: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  plan: SubscriptionPlan;
  usage: {
    requests: number;
    maxRequests: number;
  };
}

declare module 'next-auth' {
  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
    interface JWT extends NextAuthJWT {
        id: string;
        plan: SubscriptionPlan;
        usage: {
            requests: number;
            maxRequests: number;
        };
    }
}
