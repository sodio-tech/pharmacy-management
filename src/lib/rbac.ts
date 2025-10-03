import { NextRequest, NextResponse } from "next/server";

export enum UserRole {
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
    // Get session from Express backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/me`, {
      headers: {
        'Cookie': request.headers.get('cookie') || '',
        'Authorization': request.headers.get('authorization') || '',
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (!data.user) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role as UserRole
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