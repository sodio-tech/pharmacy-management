import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, UserRole } from "@/lib/rbac";
import { z } from "zod";

const updateProductSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  description: z.string().max(1000).optional(),
  category: z.enum(["OTC", "PRESCRIPTION", "SUPPLEMENT"]).optional(),
  unit: z.string().min(1).max(20).optional(),
  hsnCode: z.string().max(20).optional(),
  gstRate: z.number().min(0).max(100).optional(),
  price: z.number().min(0).optional(),
  reorderLevel: z.number().min(0).optional(),
});

// GET /api/products/[id] - Get product details with batches
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req, user) => {
    const productId = params.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        sku: true,
        name: true,
        description: true,
        category: true,
        unit: true,
        hsnCode: true,
        gstRate: true,
        price: true,
        reorderLevel: true,
        createdAt: true,
        updatedAt: true,
        batches: {
          select: {
            id: true,
            batchNumber: true,
            mfgDate: true,
            expiryDate: true,
            quantity: true,
            costPrice: true,
            sellingPrice: true,
            supplier: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { expiryDate: "asc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Calculate stock information
    const totalStock = product.batches.reduce((sum, batch) => sum + batch.quantity, 0);
    const expiringSoonBatches = product.batches.filter(batch => {
      const expiryDate = new Date(batch.expiryDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return expiryDate <= thirtyDaysFromNow;
    });

    return NextResponse.json({
      product: {
        ...product,
        totalStock,
        isLowStock: totalStock <= product.reorderLevel,
        expiringSoonCount: expiringSoonBatches.length,
        expiringSoonStock: expiringSoonBatches.reduce((sum, batch) => sum + batch.quantity, 0),
      },
    });
  });
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(
    request,
    async (req, user) => {
      const productId = params.id;
      const body = await req.json();
      const updateData = updateProductSchema.parse(body);

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: updateData,
        select: {
          id: true,
          sku: true,
          name: true,
          description: true,
          category: true,
          unit: true,
          hsnCode: true,
          gstRate: true,
          price: true,
          reorderLevel: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({ 
        message: "Product updated successfully",
        product: updatedProduct 
      });
    },
    [UserRole.ADMIN, UserRole.PHARMACIST]
  );
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(
    request,
    async (req, user) => {
      const productId = params.id;

      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          name: true,
          batches: { select: { id: true } },
          saleItems: { select: { id: true } },
          prescriptionItems: { select: { id: true } },
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      // Check if product has sales or prescription history
      if (product.saleItems.length > 0 || product.prescriptionItems.length > 0) {
        return NextResponse.json(
          { error: "Cannot delete product with sales or prescription history. Consider deactivating instead." },
          { status: 400 }
        );
      }

      // Delete related batches first, then product
      await prisma.batch.deleteMany({
        where: { productId: productId },
      });

      await prisma.product.delete({
        where: { id: productId },
      });

      return NextResponse.json({ 
        message: `Product "${product.name}" deleted successfully` 
      });
    },
    [UserRole.ADMIN]
  );
}