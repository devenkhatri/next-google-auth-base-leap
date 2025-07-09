import { SubscriptionPlan } from './types';

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'For personal use and exploration.',
    price: '₹0',
    price_id: '', // No price ID for free plan
    currency: 'INR',
    features: ['10 requests per month', 'Basic support', 'Access to core features'],
    quota: 10,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For power users and small teams.',
    price: '₹999',
    price_id: 'price_mock_pro', // Mock Stripe Price ID
    currency: 'INR',
    features: ['1000 requests per month', 'Priority support', 'Access to all features', 'Usage analytics'],
    quota: 1000,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with custom needs.',
    price: 'Contact Us',
    price_id: 'price_mock_enterprise', // Mock Stripe Price ID
    currency: 'INR',
    features: ['Unlimited requests', 'Dedicated support', 'Custom integrations', 'Advanced security'],
    quota: Infinity,
  },
];
