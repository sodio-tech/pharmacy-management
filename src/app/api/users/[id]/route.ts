import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, UserRole } from "@/lib/rbac";
import { z } from "zod";

const updateUserSchema = z.object({
  role: z.enum(["USER", "PHARMACIST", "ADMIN"]).optional(),
});

// GET /api/users/[id] - Get user details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(
    request,
    async (req, user) => {
      const targetUserId = params.id;

      // Users can only view their own profile unless they're admin
      if (user.role !== UserRole.ADMIN && user.id !== targetUserId) {
        return NextResponse.json(
          { error: "Forbidden - Can only view own profile" },
          { status: 403 }
        );
      }

      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          profile: true,
        },
      });

      if (!targetUser) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ user: targetUser });
    }
  );
}

// PUT /api/users/[id] - Update user role (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(
    request,
    async (req, user) => {
      const targetUserId = params.id;
      const body = await req.json();
      const { role } = updateUserSchema.parse(body);

      if (!role) {
        return NextResponse.json(
          { error: "No valid fields to update" },
          { status: 400 }
        );
      }

      // Prevent admin from demoting themselves
      if (user.id === targetUserId && role !== UserRole.ADMIN) {
        return NextResponse.json(
          { error: "Cannot change your own admin role" },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: targetUserId },
        data: { role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({ 
        message: "User role updated successfully",
        user: updatedUser 
      });
    },
    [UserRole.ADMIN]
  );
}