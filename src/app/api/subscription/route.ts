import { NextRequest, NextResponse } from 'next/server';
import { withAuth, UserRole } from '@/lib/rbac';
import { 
  getUserSubscription, 
  updateUserSubscription, 
  SUBSCRIPTION_LIMITS,
  SubscriptionTier 
} from '@/lib/subscription';

// Get current subscription details
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    const subscription = await getUserSubscription(user.id);
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    const limits = SUBSCRIPTION_LIMITS[subscription.tier as SubscriptionTier];

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        tier: subscription.tier,
        isActive: subscription.isActive,
        expiresAt: subscription.expiresAt,
        limits: {
          maxAdmins: subscription.maxAdmins,
          maxPharmacists: subscription.maxPharmacists,
          currentAdmins: subscription.currentAdmins,
          currentPharmacists: subscription.currentPharmacists,
        },
        features: limits.features,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
      }
    });
  });
}

// Update subscription tier (Admin only)
export async function PUT(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Only admins can update subscription' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { tier } = body;

    if (!Object.values(SubscriptionTier).includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    try {
      const updatedSubscription = await updateUserSubscription(user.id, tier as SubscriptionTier);
      const limits = SUBSCRIPTION_LIMITS[tier as SubscriptionTier];

      return NextResponse.json({
        message: 'Subscription updated successfully',
        subscription: {
          id: updatedSubscription.id,
          tier: updatedSubscription.tier,
          isActive: updatedSubscription.isActive,
          expiresAt: updatedSubscription.expiresAt,
          limits: {
            maxAdmins: updatedSubscription.maxAdmins,
            maxPharmacists: updatedSubscription.maxPharmacists,
            currentAdmins: updatedSubscription.currentAdmins,
            currentPharmacists: updatedSubscription.currentPharmacists,
          },
          features: limits.features,
        }
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      );
    }
  }, [UserRole.ADMIN]);
}
