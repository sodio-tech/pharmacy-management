import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, UserRole } from "@/lib/rbac";

// GET /api/products/barcode - Search product by barcode
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    const { searchParams } = new URL(req.url);
    const barcode = searchParams.get("barcode");

    if (!barcode) {
      return NextResponse.json(
        { error: "Barcode parameter is required" },
        { status: 400 }
      );
    }

    try {
      // Search for product by SKU (assuming SKU is used as barcode)
      const product = await prisma.product.findUnique({
        where: { sku: barcode },
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
              quantity: true,
              expiryDate: true,
              sellingPrice: true,
              supplier: {
                select: {
                  id: true,
                  name: true,
                },
              },
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

      const enrichedProduct = {
        ...product,
        totalStock,
        isLowStock: totalStock <= product.reorderLevel,
        isOutOfStock: totalStock === 0,
        expiringSoonCount: expiringSoonBatches.length,
        expiringSoonStock: expiringSoonBatches.reduce((sum, batch) => sum + batch.quantity, 0),
        nearestExpiry: product.batches.length > 0 ? product.batches[0].expiryDate : null,
        currentPrice: product.batches.length > 0 && product.batches[0].sellingPrice 
          ? product.batches[0].sellingPrice 
          : product.price,
      };

      return NextResponse.json({
        product: enrichedProduct,
        found: true,
      });
    } catch (error) {
      console.error("Error searching product by barcode:", error);
      return NextResponse.json(
        { error: "Failed to search product" },
        { status: 500 }
      );
    }
  });
}