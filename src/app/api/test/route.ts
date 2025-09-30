import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/rbac";

// GET /api/test - Simple test endpoint
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    return NextResponse.json({
      message: "Authentication working!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      timestamp: new Date().toISOString(),
    });
  });
}