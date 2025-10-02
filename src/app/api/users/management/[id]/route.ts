import { NextRequest, NextResponse } from 'next/server';
import { withAuth, UserRole } from '@/lib/rbac';
import prisma from '@/lib/prisma';
import { decrementUserCount, incrementUserCount, checkUserLimit } from '@/lib/subscription';

// Get specific user details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req, user) => {
    const userId = params.id;

    // Users can only view their own profile unless they're admin
    if (user.role !== UserRole.ADMIN && user.id !== userId) {
      return NextResponse.json(
        { error: 'You can only view your own profile' },
        { status: 403 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        pharmacyName: true,
        drugLicenseNumber: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            phone: true,
            specialization: true,
            address: true,
            licenseNumber: true,
            qualifications: true,
            experience: true,
            bio: true,
          }
        },
        subscription: {
          select: {
            tier: true,
            currentAdmins: true,
            currentPharmacists: true,
            maxAdmins: true,
            maxPharmacists: true,
            isActive: true,
            expiresAt: true,
          }
        }
      }
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: targetUser });
  });
}

// Update user details
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req, user) => {
    const userId = params.id;
    const body = await request.json();

    // Users can only update their own profile unless they're admin
    if (user.role !== UserRole.ADMIN && user.id !== userId) {
      return NextResponse.json(
        { error: 'You can only update your own profile' },
        { status: 403 }
      );
    }

    const { name, phoneNumber, role, isActive, profile } = body;

    try {
      // If admin is changing user role, check limits
      if (user.role === UserRole.ADMIN && role && role !== user.role) {
        const currentUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true }
        });

        if (currentUser) {
          // Decrement old role count
          await decrementUserCount(user.id, currentUser.role.toLowerCase() as 'admin' | 'pharmacist');
          
          // Check if we can add new role
          const canAddUser = await checkUserLimit(user.id, role.toLowerCase() as 'admin' | 'pharmacist');
          if (!canAddUser) {
            // Revert the decrement
            await incrementUserCount(user.id, currentUser.role.toLowerCase() as 'admin' | 'pharmacist');
            return NextResponse.json(
              { error: 'User limit exceeded for current subscription tier' },
              { status: 400 }
            );
          }
          
          // Increment new role count
          await incrementUserCount(user.id, role.toLowerCase() as 'admin' | 'pharmacist');
        }
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(phoneNumber && { phoneNumber }),
          ...(role && { role: role as UserRole }),
          ...(isActive !== undefined && { isActive }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          updatedAt: true,
        }
      });

      // Update profile if provided
      if (profile) {
        await prisma.profile.upsert({
          where: { userId },
          update: {
            phone: profile.phone,
            specialization: profile.specialization,
            address: profile.address,
            licenseNumber: profile.licenseNumber,
            qualifications: profile.qualifications,
            experience: profile.experience,
            bio: profile.bio,
          },
          create: {
            userId,
            phone: profile.phone,
            specialization: profile.specialization,
            address: profile.address,
            licenseNumber: profile.licenseNumber,
            qualifications: profile.qualifications,
            experience: profile.experience,
            bio: profile.bio,
          }
        });
      }

      return NextResponse.json({
        message: 'User updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }
  });
}

// Delete user (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req, user) => {
    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Only admins can delete users' },
        { status: 403 }
      );
    }

    const userId = params.id;

    // Prevent admin from deleting themselves
    if (user.id === userId) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    try {
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      if (!targetUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Delete user (cascade will handle related records)
      await prisma.user.delete({
        where: { id: userId }
      });

      // Update subscription counts
      await decrementUserCount(user.id, targetUser.role.toLowerCase() as 'admin' | 'pharmacist');

      return NextResponse.json({
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }
  }, [UserRole.ADMIN]);
}
