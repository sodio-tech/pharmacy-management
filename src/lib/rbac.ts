import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import prisma from "./prisma";

export enum UserRole {
  USER = "USER",
  PHARMACIST = "PHARMACIST", 
  ADMIN = "ADMIN"
}

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Get session using Better Auth
    const session = await auth.api.getSession({
      headers: request.headers as any
    });

    if (!session || !session.user) {
      return null;
    }

    // Get user with role from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole
    };
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return null;
  }
}

export function createRBACMiddleware(allowedRoles: UserRole[] = []) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const user = await getAuthenticatedUser(request);

    // Check if user is authenticated
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    // If no specific roles required, just need to be authenticated
    if (allowedRoles.length === 0) {
      return null;
    }

    // Check if user has required role
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      );
    }

    return null;
  };
}

// Specific role checks
export const requireAuth = createRBACMiddleware();
export const requireAdmin = createRBACMiddleware([UserRole.ADMIN]);
export const requirePharmacist = createRBACMiddleware([UserRole.PHARMACIST]);
export const requireAdminOrPharmacist = createRBACMiddleware([UserRole.ADMIN, UserRole.PHARMACIST]);

// Helper function for API routes
export async function withAuth<T>(
  request: NextRequest,
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<T>,
  allowedRoles: UserRole[] = []
): Promise<NextResponse | T> {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized - Please log in" },
      { status: 401 }
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: "Forbidden - Insufficient permissions" },
      { status: 403 }
    );
  }

  return handler(request, user);
}