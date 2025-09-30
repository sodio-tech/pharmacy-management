import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, UserRole } from "@/lib/rbac";
import { z } from "zod";

const getPrescriptionsSchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("20"),
  status: z.enum(["UPLOADED", "PENDING_VALIDATION", "VALIDATED", "REJECTED"]).optional(),
  search: z.string().optional(),
});

const createPrescriptionSchema = z.object({
  patientName: z.string().min(2).max(100),
  patientPhone: z.string().min(10).max(15).optional(),
  patientAge: z.number().min(0).max(150).optional(),
  doctorName: z.string().min(2).max(100).optional(),
  notes: z.string().max(1000).optional(),
});

// GET /api/prescriptions - List prescriptions
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    const { searchParams } = new URL(req.url);
    const params = getPrescriptionsSchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      status: searchParams.get("status"),
      search: searchParams.get("search"),
    });

    const page = parseInt(params.page);
    const limit = parseInt(params.limit);
    const offset = (page - 1) * limit;

    const where: any = {};

    // Non-admin users can only see their own uploaded prescriptions
    if (user.role === UserRole.USER) {
      where.uploadedBy = user.id;
    }
    
    if (params.status) {
      where.status = params.status;
    }
    
    if (params.search) {
      where.OR = [
        { patientName: { contains: params.search, mode: "insensitive" } },
        { patientPhone: { contains: params.search, mode: "insensitive" } },
        { doctorName: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where,
        select: {
          id: true,
          patientName: true,
          patientPhone: true,
          patientAge: true,
          doctorName: true,
          status: true,
          fileUrl: true,
          fileName: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
          validatedUser: {
            select: {
              id: true,
              name: true,
            },
          },
          items: {
            select: {
              id: true,
              medichineName: true,
              dosage: true,
              quantity: true,
              instructions: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
          _count: {
            select: {
              sales: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.prescription.count({ where }),
    ]);

    return NextResponse.json({
      prescriptions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });
}

// POST /api/prescriptions - Create new prescription (without file upload)
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    const body = await req.json();
    const prescriptionData = createPrescriptionSchema.parse(body);

    const prescription = await prisma.prescription.create({
      data: {
        ...prescriptionData,
        uploadedBy: user.id,
        status: "UPLOADED",
      },
      select: {
        id: true,
        patientName: true,
        patientPhone: true,
        patientAge: true,
        doctorName: true,
        status: true,
        notes: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ 
      message: "Prescription created successfully",
      prescription 
    }, { status: 201 });
  });
}