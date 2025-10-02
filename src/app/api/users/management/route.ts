import { NextRequest, NextResponse } from 'next/server';
import { withAuth, UserRole } from '@/lib/rbac';
import prisma from '@/lib/prisma';
import { checkUserLimit, incrementUserCount, decrementUserCount, getUserSubscription } from '@/lib/subscription';

// Get all users (Admin only)
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Only admins can view all users' },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        subscription: {
          select: {
            tier: true,
            currentAdmins: true,
            currentPharmacists: true,
            maxAdmins: true,
            maxPharmacists: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ users });
  }, [UserRole.ADMIN]);
}

// Add new user (Admin only)
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Only admins can add users' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, phoneNumber, pharmacyName, drugLicenseNumber, role } = body;

    // Validate required fields
    if (!name || !email || !phoneNumber || !pharmacyName || !drugLicenseNumber || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Check subscription limits
    const canAddUser = await checkUserLimit(user.id, role.toLowerCase() as 'admin' | 'pharmacist');
    if (!canAddUser) {
      return NextResponse.json(
        { error: 'User limit exceeded for current subscription tier' },
        { status: 400 }
      );
    }

    try {
      // Create user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          phoneNumber,
          pharmacyName,
          drugLicenseNumber,
          role: role as UserRole,
          subscriptionTier: 'FREE', // Default to FREE tier
        }
      });

      // Update subscription counts
      await incrementUserCount(user.id, role.toLowerCase() as 'admin' | 'pharmacist');

      // Create profile for the user
      await prisma.profile.create({
        data: {
          userId: newUser.id,
        }
      });

      // Create subscription for the new user
      await prisma.subscription.create({
        data: {
          userId: newUser.id,
          tier: 'FREE',
          maxAdmins: 1,
          maxPharmacists: 1,
          currentAdmins: 0,
          currentPharmacists: 0,
        }
      });

      return NextResponse.json({
        message: 'User created successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        }
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }
  }, [UserRole.ADMIN]);
}
