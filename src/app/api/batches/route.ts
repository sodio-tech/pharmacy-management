import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, UserRole } from "@/lib/rbac";
import { z } from "zod";

const createBatchSchema = z.object({
  batchNumber: z.string().min(1).max(50),
  productId: z.string().uuid(),
  supplierId: z.string().uuid(),
  mfgDate: z.string().transform(str => new Date(str)),
  expiryDate: z.string().transform(str => new Date(str)),
  quantity: z.number().min(1),
  costPrice: z.number().min(0),
  sellingPrice: z.number().min(0).optional(),
});

const getBatchesSchema = z.object({
  productId: z.string().uuid().optional(),
  supplierId: z.string().uuid().optional(),
  expiringSoon: z.string().optional(),
  lowStock: z.string().optional(),
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("20"),
});

// GET /api/batches - List batches with filtering
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    const { searchParams } = new URL(req.url);
    const params = getBatchesSchema.parse({
      productId: searchParams.get("productId"),
      supplierId: searchParams.get("supplierId"),
      expiringSoon: searchParams.get("expiringSoon"),
      lowStock: searchParams.get("lowStock"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    const page = parseInt(params.page);
    const limit = parseInt(params.limit);
    const offset = (page - 1) * limit;

    const where: any = {};
    
    if (params.productId) {
      where.productId = params.productId;
    }
    
    if (params.supplierId) {
      where.supplierId = params.supplierId;
    }

    if (params.expiringSoon === "true") {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      where.expiryDate = { lte: thirtyDaysFromNow };
    }

    if (params.lowStock === "true") {
      where.quantity = { lte: 10 }; // Consider customizable threshold
    }

    const [batches, total] = await Promise.all([
      prisma.batch.findMany({
        where,
        select: {
          id: true,
          batchNumber: true,
          mfgDate: true,
          expiryDate: true,
          quantity: true,
          costPrice: true,
          sellingPrice: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              sku: true,
              name: true,
              unit: true,
              reorderLevel: true,
            },
          },
          supplier: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
        orderBy: { expiryDate: "asc" },
        skip: offset,
        take: limit,
      }),
      prisma.batch.count({ where }),
    ]);

    // Add calculated fields
    const enrichedBatches = batches.map(batch => {
      const expiryDate = new Date(batch.expiryDate);
      const today = new Date();
      const daysToExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...batch,
        daysToExpiry,
        isExpired: daysToExpiry < 0,
        isExpiringSoon: daysToExpiry <= 30 && daysToExpiry >= 0,
        isLowStock: batch.quantity <= (batch.product.reorderLevel || 10),
      };
    });

    return NextResponse.json({
      batches: enrichedBatches,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });
}

// POST /api/batches - Add new batch (stock receipt)
export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      const body = await req.json();
      const batchData = createBatchSchema.parse(body);

      // Validate that product and supplier exist
      const [product, supplier] = await Promise.all([
        prisma.product.findUnique({ where: { id: batchData.productId } }),
        prisma.supplier.findUnique({ where: { id: batchData.supplierId } }),
      ]);

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      if (!supplier) {
        return NextResponse.json(
          { error: "Supplier not found" },
          { status: 404 }
        );
      }

      // Validate expiry date is in the future
      if (batchData.expiryDate <= new Date()) {
        return NextResponse.json(
          { error: "Expiry date must be in the future" },
          { status: 400 }
        );
      }

      // Validate manufacturing date is not in the future
      if (batchData.mfgDate > new Date()) {
        return NextResponse.json(
          { error: "Manufacturing date cannot be in the future" },
          { status: 400 }
        );
      }

      // Check for duplicate batch number for the same product
      const existingBatch = await prisma.batch.findUnique({
        where: {
          batchNumber_productId: {
            batchNumber: batchData.batchNumber,
            productId: batchData.productId,
          },
        },
      });

      if (existingBatch) {
        return NextResponse.json(
          { error: "Batch number already exists for this product" },
          { status: 400 }
        );
      }

      // Set default selling price if not provided
      const finalBatchData = {
        ...batchData,
        sellingPrice: batchData.sellingPrice || product.price,
      };

      const batch = await prisma.batch.create({
        data: finalBatchData,
        select: {
          id: true,
          batchNumber: true,
          mfgDate: true,
          expiryDate: true,
          quantity: true,
          costPrice: true,
          sellingPrice: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              sku: true,
              name: true,
              unit: true,
            },
          },
          supplier: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return NextResponse.json({ 
        message: "Batch added successfully",
        batch 
      }, { status: 201 });
    },
    [UserRole.ADMIN, UserRole.PHARMACIST]
  );
}