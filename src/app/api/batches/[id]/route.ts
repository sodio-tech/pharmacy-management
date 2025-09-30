import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, UserRole } from "@/lib/rbac";
import { z } from "zod";

const updateBatchSchema = z.object({
  batchNumber: z.string().min(1).max(50).optional(),
  mfgDate: z.string().transform(str => new Date(str)).optional(),
  expiryDate: z.string().transform(str => new Date(str)).optional(),
  quantity: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  sellingPrice: z.number().min(0).optional(),
});

// GET /api/batches/[id] - Get batch details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req, user) => {
    const batchId = params.id;

    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      select: {
        id: true,
        batchNumber: true,
        mfgDate: true,
        expiryDate: true,
        quantity: true,
        costPrice: true,
        sellingPrice: true,
        createdAt: true,
        updatedAt: true,
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
            email: true,
          },
        },
        saleItems: {
          select: { id: true },
        },
      },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Batch not found" },
        { status: 404 }
      );
    }

    // Add calculated fields
    const expiryDate = new Date(batch.expiryDate);
    const today = new Date();
    const daysToExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      batch: {
        ...batch,
        daysToExpiry,
        isExpired: daysToExpiry < 0,
        isExpiringSoon: daysToExpiry <= 30 && daysToExpiry >= 0,
        isLowStock: batch.quantity <= (batch.product.reorderLevel || 10),
        hasSales: batch.saleItems.length > 0,
      },
    });
  });
}

// PUT /api/batches/[id] - Update batch
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(
    request,
    async (req, user) => {
      const batchId = params.id;
      const body = await req.json();
      const updateData = updateBatchSchema.parse(body);

      const batch = await prisma.batch.findUnique({
        where: { id: batchId },
        select: {
          id: true,
          batchNumber: true,
          productId: true,
          saleItems: { select: { id: true } },
        },
      });

      if (!batch) {
        return NextResponse.json(
          { error: "Batch not found" },
          { status: 404 }
        );
      }

      // Validate dates if provided
      if (updateData.expiryDate && updateData.expiryDate <= new Date()) {
        return NextResponse.json(
          { error: "Expiry date must be in the future" },
          { status: 400 }
        );
      }

      if (updateData.mfgDate && updateData.mfgDate > new Date()) {
        return NextResponse.json(
          { error: "Manufacturing date cannot be in the future" },
          { status: 400 }
        );
      }

      // Check for duplicate batch number if it's being updated
      if (updateData.batchNumber && updateData.batchNumber !== batch.batchNumber) {
        const existingBatch = await prisma.batch.findUnique({
          where: {
            batchNumber_productId: {
              batchNumber: updateData.batchNumber,
              productId: batch.productId,
            },
          },
        });

        if (existingBatch) {
          return NextResponse.json(
            { error: "Batch number already exists for this product" },
            { status: 400 }
          );
        }
      }

      const updatedBatch = await prisma.batch.update({
        where: { id: batchId },
        data: updateData,
        select: {
          id: true,
          batchNumber: true,
          mfgDate: true,
          expiryDate: true,
          quantity: true,
          costPrice: true,
          sellingPrice: true,
          updatedAt: true,
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
        message: "Batch updated successfully",
        batch: updatedBatch 
      });
    },
    [UserRole.ADMIN, UserRole.PHARMACIST]
  );
}

// DELETE /api/batches/[id] - Delete batch
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(
    request,
    async (req, user) => {
      const batchId = params.id;

      const batch = await prisma.batch.findUnique({
        where: { id: batchId },
        select: {
          id: true,
          batchNumber: true,
          saleItems: { select: { id: true } },
          product: { select: { name: true } },
        },
      });

      if (!batch) {
        return NextResponse.json(
          { error: "Batch not found" },
          { status: 404 }
        );
      }

      // Check if batch has sales history
      if (batch.saleItems.length > 0) {
        return NextResponse.json(
          { error: "Cannot delete batch with sales history" },
          { status: 400 }
        );
      }

      await prisma.batch.delete({
        where: { id: batchId },
      });

      return NextResponse.json({ 
        message: `Batch "${batch.batchNumber}" deleted successfully` 
      });
    },
    [UserRole.ADMIN]
  );
}