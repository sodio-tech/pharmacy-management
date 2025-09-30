import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/rbac";

// GET /api/auth/session - Get current user session with role
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get additional user details
    const userDetails = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        profile: {
          select: {
            phone: true,
            specialization: true,
            licenseNumber: true,
          },
        },
      },
    });

    return NextResponse.json({
      user: userDetails,
      authenticated: true,
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}