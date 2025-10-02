import prisma from './prisma';

export enum SubscriptionTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

export interface SubscriptionLimits {
  maxAdmins: number;
  maxPharmacists: number;
  maxProducts: number;
  maxInvoicesPerMonth: number;
  maxSuppliers: number;
  features: {
    prescriptionHandling: boolean;
    multiPayment: boolean;
    discounts: boolean;
    advancedReports: boolean;
    compliance: boolean;
    medicineInfo: boolean;
    notifications: boolean;
    integrations: boolean;
    aiFeatures: boolean;
    security: boolean;
    multiBranch: boolean;
  };
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  [SubscriptionTier.FREE]: {
    maxAdmins: 1,
    maxPharmacists: 1,
    maxProducts: 20,
    maxInvoicesPerMonth: 5,
    maxSuppliers: 5,
    features: {
      prescriptionHandling: false,
      multiPayment: false,
      discounts: false,
      advancedReports: false,
      compliance: false,
      medicineInfo: false,
      notifications: true, // Only basic stock/expiry alerts
      integrations: false,
      aiFeatures: false,
      security: false,
      multiBranch: false,
    }
  },
  [SubscriptionTier.PREMIUM]: {
    maxAdmins: 3,
    maxPharmacists: 10,
    maxProducts: 1000,
    maxInvoicesPerMonth: 1000,
    maxSuppliers: 50,
    features: {
      prescriptionHandling: true,
      multiPayment: true,
      discounts: true,
      advancedReports: true,
      compliance: true,
      medicineInfo: true,
      notifications: true,
      integrations: true,
      aiFeatures: true,
      security: true,
      multiBranch: false,
    }
  },
  [SubscriptionTier.ENTERPRISE]: {
    maxAdmins: 10,
    maxPharmacists: 100,
    maxProducts: -1, // Unlimited
    maxInvoicesPerMonth: -1, // Unlimited
    maxSuppliers: -1, // Unlimited
    features: {
      prescriptionHandling: true,
      multiPayment: true,
      discounts: true,
      advancedReports: true,
      compliance: true,
      medicineInfo: true,
      notifications: true,
      integrations: true,
      aiFeatures: true,
      security: true,
      multiBranch: true,
    }
  }
};

export async function getUserSubscription(userId: string) {
  return await prisma.subscription.findUnique({
    where: { userId },
    include: { user: true }
  });
}

export async function createUserSubscription(userId: string, tier: SubscriptionTier = SubscriptionTier.FREE) {
  const limits = SUBSCRIPTION_LIMITS[tier];
  
  return await prisma.subscription.create({
    data: {
      userId,
      tier,
      maxAdmins: limits.maxAdmins,
      maxPharmacists: limits.maxPharmacists,
      currentAdmins: 0,
      currentPharmacists: 0,
    }
  });
}

export async function updateUserSubscription(userId: string, tier: SubscriptionTier) {
  const limits = SUBSCRIPTION_LIMITS[tier];
  
  return await prisma.subscription.update({
    where: { userId },
    data: {
      tier,
      maxAdmins: limits.maxAdmins,
      maxPharmacists: limits.maxPharmacists,
    }
  });
}

export async function checkUserLimit(userId: string, userType: 'admin' | 'pharmacist'): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return false;

  const limits = SUBSCRIPTION_LIMITS[subscription.tier as SubscriptionTier];
  
  if (userType === 'admin') {
    return subscription.currentAdmins < limits.maxAdmins;
  } else {
    return subscription.currentPharmacists < limits.maxPharmacists;
  }
}

export async function incrementUserCount(userId: string, userType: 'admin' | 'pharmacist') {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return;

  const updateData = userType === 'admin' 
    ? { currentAdmins: { increment: 1 } }
    : { currentPharmacists: { increment: 1 } };

  await prisma.subscription.update({
    where: { userId },
    data: updateData
  });
}

export async function decrementUserCount(userId: string, userType: 'admin' | 'pharmacist') {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return;

  const updateData = userType === 'admin' 
    ? { currentAdmins: { decrement: 1 } }
    : { currentPharmacists: { decrement: 1 } };

  await prisma.subscription.update({
    where: { userId },
    data: updateData
  });
}

export async function checkFeatureAccess(userId: string, feature: keyof SubscriptionLimits['features']): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return false;

  const limits = SUBSCRIPTION_LIMITS[subscription.tier as SubscriptionTier];
  return limits.features[feature];
}

export async function checkProductLimit(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return false;

  const limits = SUBSCRIPTION_LIMITS[subscription.tier as SubscriptionTier];
  if (limits.maxProducts === -1) return true; // Unlimited

  const productCount = await prisma.product.count();
  return productCount < limits.maxProducts;
}

export async function checkInvoiceLimit(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return false;

  const limits = SUBSCRIPTION_LIMITS[subscription.tier as SubscriptionTier];
  if (limits.maxInvoicesPerMonth === -1) return true; // Unlimited

  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const invoiceCount = await prisma.sale.count({
    where: {
      createdAt: {
        gte: currentMonth
      }
    }
  });

  return invoiceCount < limits.maxInvoicesPerMonth;
}
