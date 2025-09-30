import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, UserRole } from "@/lib/rbac";
import { z } from "zod";

const updateProfileSchema = z.object({
  phone: z.string().min(10).max(15).optional(),
  specialization: z.string().min(2).max(100).optional(),
  address: z.string().min(10).max(500).optional(),
  licenseNumber: z.string().min(5).max(50).optional(),
});

// GET /api/users/profile - Get current user profile
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        profile: true,
      },
    });

    return NextResponse.json({ user: userProfile });
  });
}

// PUT /api/users/profile - Update current user profile
export async function PUT(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    const body = await req.json();
    const profileData = updateProfileSchema.parse(body);

    // Only pharmacists can update detailed profile
    if (user.role === UserRole.USER && Object.keys(profileData).length > 0) {
      return NextResponse.json(
        { error: "Only pharmacists can update detailed profile information" },
        { status: 403 }
      );
    }

    // Create or update profile
    const updatedProfile = await prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ...profileData,
      },
      update: profileData,
    });

    // Get updated user with profile
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        profile: true,
      },
    });

    return NextResponse.json({ 
      message: "Profile updated successfully",
      user: updatedUser 
    });
  });
}