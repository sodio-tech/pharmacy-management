import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, UserRole } from "@/lib/rbac";
import { z } from "zod";

const getUsersSchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  role: z.enum(["USER", "PHARMACIST", "ADMIN"]).optional(),
  search: z.string().optional(),
});

// GET /api/users - List all users (Admin only)
export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      const { searchParams } = new URL(req.url);
      const params = getUsersSchema.parse({
        page: searchParams.get("page"),
        limit: searchParams.get("limit"), 
        role: searchParams.get("role"),
        search: searchParams.get("search"),
      });

      const page = parseInt(params.page);
      const limit = parseInt(params.limit);
      const offset = (page - 1) * limit;

      const where: any = {};
      
      if (params.role) {
        where.role = params.role;
      }
      
      if (params.search) {
        where.OR = [
          { name: { contains: params.search, mode: "insensitive" } },
          { email: { contains: params.search, mode: "insensitive" } },
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
            profile: {
              select: {
                phone: true,
                specialization: true,
                licenseNumber: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: offset,
          take: limit,
        }),
        prisma.user.count({ where }),
      ]);

      return NextResponse.json({
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    },
    [UserRole.ADMIN]
  );
}