'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Download, Crown, Star, Zap } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
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

interface CurrentSubscription {
  tier: string;
  isActive: boolean;
  expiresAt?: string;
  limits: {
    maxAdmins: number;
    maxPharmacists: number;
    currentAdmins: number;
    currentPharmacists: number;
  };
  features: Record<string, boolean>;
}

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const [plansResponse, subscriptionResponse] = await Promise.all([
        fetch('/api/subscription/plans'),
        fetch('/api/subscription')
      ]);

      const plansData = await plansResponse.json();
      const subscriptionData = await subscriptionResponse.json();

      setPlans(plansData.plans);
      setCurrentSubscription(subscriptionData.subscription);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async (planId: string) => {
    try {
      const response = await fetch('/api/subscription', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier: planId.toUpperCase() }),
      });

      if (response.ok) {
        await fetchSubscriptionData();
      }
    } catch (error) {
      console.error('Error changing plan:', error);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Crown className="h-6 w-6 text-green-600" />;
      case 'premium':
        return <Star className="h-6 w-6 text-blue-600" />;
      case 'enterprise':
        return <Zap className="h-6 w-6 text-purple-600" />;
      default:
        return <Crown className="h-6 w-6 text-gray-600" />;
    }
  };

  const getPlanButtonText = (plan: SubscriptionPlan) => {
    if (plan.isCurrent) return 'Your Current Plan';
    if (plan.id === 'custom') return 'Contact Sales';
    if (plan.id === 'enterprise') return 'Start Free Trial';
    return 'Get Started';
  };

  const getPlanButtonVariant = (plan: SubscriptionPlan) => {
    if (plan.isCurrent) return 'default';
    if (plan.isPopular) return 'default';
    if (plan.id === 'custom') return 'outline';
    return 'outline';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription</h1>
          <p className="text-gray-600">Manage your account, organization, and subscription.</p>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Find the perfect plan for your pharmacy</h2>
          <p className="text-gray-600">Start for free and scale as you grow. All plans include our core features.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.isPopular ? 'ring-2 ring-blue-500' : ''} ${plan.isCurrent ? 'bg-green-50 border-green-200' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2">
                  {getPlanIcon(plan.id)}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600">/{plan.interval}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full"
                  variant={getPlanButtonVariant(plan)}
                  onClick={() => handlePlanChange(plan.id)}
                  disabled={plan.isCurrent || plan.id === 'custom'}
                >
                  {getPlanButtonText(plan)}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Current Usage */}
      {currentSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Current Usage</CardTitle>
            <CardDescription>Your current subscription limits and usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">User Limits</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Admins</span>
                    <span>{currentSubscription.limits.currentAdmins} / {currentSubscription.limits.maxAdmins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pharmacists</span>
                    <span>{currentSubscription.limits.currentPharmacists} / {currentSubscription.limits.maxPharmacists}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Available Features</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(currentSubscription.features).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center text-sm">
                      <Check className={`h-4 w-4 mr-2 ${enabled ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={enabled ? 'text-gray-900' : 'text-gray-400'}>
                        {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Download your previous invoices</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Manage Billing
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: '#INV-2024-003', date: 'Sep 15, 2024', amount: '$0.00', status: 'Paid' },
              { id: '#INV-2024-002', date: 'Aug 15, 2024', amount: '$0.00', status: 'Paid' },
              { id: '#INV-2024-001', date: 'Jul 15, 2024', amount: '$0.00', status: 'Paid' },
            ].map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="font-medium">{invoice.id}</div>
                    <div className="text-sm text-gray-600">{invoice.date}</div>
                  </div>
                  <div className="text-sm font-medium">{invoice.amount}</div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {invoice.status}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
