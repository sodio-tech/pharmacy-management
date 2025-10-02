import { NextRequest, NextResponse } from 'next/server';
import { SUBSCRIPTION_LIMITS, SubscriptionTier } from '@/lib/subscription';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    maxAdmins: number;
    maxPharmacists: number;
    maxProducts: number;
    maxInvoicesPerMonth: number;
    maxSuppliers: number;
  };
  isPopular?: boolean;
  isCurrent?: boolean;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Community',
    description: 'Perfect to get started',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      '1 Branch',
      'Up to 20 items',
      '10 invoices/month',
      '5 suppliers max',
      'Basic expiry alerts',
      'Sales reports only',
      '1 Admin + 1 Pharmacist'
    ],
    limits: {
      maxAdmins: 1,
      maxPharmacists: 1,
      maxProducts: 20,
      maxInvoicesPerMonth: 5,
      maxSuppliers: 5,
    }
  },
  {
    id: 'premium',
    name: 'Basic',
    description: 'For independent pharmacies',
    price: 49,
    currency: 'USD',
    interval: 'month',
    features: [
      '1 Branch',
      'Admin + Pharmacist roles',
      'Unlimited inventory',
      'Multi-payment support',
      'Manual prescriptions',
      'Basic + expiry reports',
      'Email/SMS alerts',
      'Up to 3 Admins + 10 Pharmacists'
    ],
    limits: {
      maxAdmins: 3,
      maxPharmacists: 10,
      maxProducts: 1000,
      maxInvoicesPerMonth: 1000,
      maxSuppliers: 50,
    }
  },
  {
    id: 'enterprise',
    name: 'Pro',
    description: 'For growing pharmacies',
    price: 99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Up to 5 branches',
      'Everything in Basic +',
      'AI-powered OCR',
      'Stock forecasting',
      'Supplier management',
      'Advanced analytics',
      'WhatsApp alerts',
      'Up to 10 Admins + 100 Pharmacists'
    ],
    limits: {
      maxAdmins: 10,
      maxPharmacists: 100,
      maxProducts: -1, // Unlimited
      maxInvoicesPerMonth: -1, // Unlimited
      maxSuppliers: -1, // Unlimited
    },
    isPopular: true
  },
  {
    id: 'custom',
    name: 'Enterprise',
    description: 'For large networks',
    price: 0, // Custom pricing
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited branches',
      'Everything in Pro +',
      'Franchise dashboard',
      'Custom integrations',
      'Fraud detection',
      'Voice search',
      'Dedicated manager',
      'Priority support',
      'Unlimited users'
    ],
    limits: {
      maxAdmins: -1, // Unlimited
      maxPharmacists: -1, // Unlimited
      maxProducts: -1, // Unlimited
      maxInvoicesPerMonth: -1, // Unlimited
      maxSuppliers: -1, // Unlimited
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      plans: SUBSCRIPTION_PLANS,
      currentLimits: SUBSCRIPTION_LIMITS
    });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription plans' },
      { status: 500 }
    );
  }
}
