import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/rbac";

// GET /api/auth/me - Get current authenticated user with role and profile
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    return NextResponse.json({
      user,
      authenticated: true,
    });
  });
}