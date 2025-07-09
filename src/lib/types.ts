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
  plan: SubscriptionPlan;
  usage: {
    requests: number;
    maxRequests: number;
  };
}
