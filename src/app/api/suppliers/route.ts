import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, UserRole } from "@/lib/rbac";
import { z } from "zod";

const createSupplierSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15).optional(),
  address: z.string().max(500).optional(),
  gstNumber: z.string().max(15).optional(),
  contactPerson: z.string().max(100).optional(),
});

const getSuppliersSchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("20"),
  search: z.string().optional(),
});

// GET /api/suppliers - List suppliers
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    const { searchParams } = new URL(req.url);
    const params = getSuppliersSchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
    });

    const page = parseInt(params.page);
    const limit = parseInt(params.limit);
    const offset = (page - 1) * limit;

    const where: any = {};
    
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { email: { contains: params.search, mode: "insensitive" } },
        { phone: { contains: params.search, mode: "insensitive" } },
        { contactPerson: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          gstNumber: true,
          contactPerson: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              batches: true,
            },
          },
        },
        orderBy: { name: "asc" },
        skip: offset,
        take: limit,
      }),
      prisma.supplier.count({ where }),
    ]);

    return NextResponse.json({
      suppliers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });
}

// POST /api/suppliers - Create new supplier
export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      const body = await req.json();
      const supplierData = createSupplierSchema.parse(body);

      // Check if supplier with same name already exists
      const existingSupplier = await prisma.supplier.findFirst({
        where: { 
          name: { equals: supplierData.name, mode: "insensitive" } 
        },
      });

      if (existingSupplier) {
        return NextResponse.json(
          { error: "Supplier with this name already exists" },
          { status: 400 }
        );
      }

      const supplier = await prisma.supplier.create({
        data: supplierData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          gstNumber: true,
          contactPerson: true,
          createdAt: true,
        },
      });

      return NextResponse.json({ 
        message: "Supplier created successfully",
        supplier 
      }, { status: 201 });
    },
    [UserRole.ADMIN, UserRole.PHARMACIST]
  );
}