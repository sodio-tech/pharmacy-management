import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/rbac";
import { z } from "zod";

const barcodeSearchSchema = z.object({
  barcode: z.string().min(1).max(50),
});

const updateBarcodeSchema = z.object({
  productId: z.string().uuid(),
  barcode: z.string().min(1).max(50),
});

// GET /api/products/barcode?barcode=12345 - Search product by barcode
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    const { searchParams } = new URL(req.url);
    const params = barcodeSearchSchema.parse({
      barcode: searchParams.get("barcode"),
    });

    const product = await prisma.product.findFirst({
      where: { 
        sku: params.barcode // Using SKU as barcode for now
      },
      select: {
        id: true,
        sku: true,
        name: true,
        description: true,
        category: true,
        unit: true,
        price: true,
        reorderLevel: true,
        batches: {
          select: {
            id: true,
            batchNumber: true,
            quantity: true,
            expiryDate: true,
            sellingPrice: true,
          },
          where: {
            quantity: { gt: 0 },
          },
          orderBy: { expiryDate: "asc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found for this barcode" },
        { status: 404 }
      );
    }

    const totalStock = product.batches.reduce((sum, batch) => sum + batch.quantity, 0);

    return NextResponse.json({
      product: {
        ...product,
        totalStock,
        isLowStock: totalStock <= product.reorderLevel,
        availableBatches: product.batches.length,
      },
    });
  });
}

// POST /api/products/barcode - Add/Update barcode for product
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    const body = await req.json();
    const data = updateBarcodeSchema.parse(body);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if barcode already exists for another product
    const existingProduct = await prisma.product.findFirst({
      where: { 
        sku: data.barcode,
        NOT: { id: data.productId }
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Barcode already assigned to another product" },
        { status: 400 }
      );
    }

    // Update product with barcode (using SKU field)
    const updatedProduct = await prisma.product.update({
      where: { id: data.productId },
      data: { sku: data.barcode },
      select: {
        id: true,
        sku: true,
        name: true,
        category: true,
      },
    });

    return NextResponse.json({
      message: "Barcode updated successfully",
      product: updatedProduct,
    });
  });
}