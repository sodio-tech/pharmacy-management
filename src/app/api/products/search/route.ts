import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, UserRole } from "@/lib/rbac";

// GET /api/products/search - Search products by name, SKU, or description
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters long" },
        { status: 400 }
      );
    }

    try {
      const where: any = {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { sku: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      };

      if (category) {
        where.category = category;
      }

      const products = await prisma.product.findMany({
        where,
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
        orderBy: [
          { name: "asc" },
        ],
        take: limit,
      });

      // Enrich products with stock information
      const enrichedProducts = products.map(product => {
        const totalStock = product.batches.reduce((sum, batch) => sum + batch.quantity, 0);
        const expiringSoonBatches = product.batches.filter(batch => {
          const expiryDate = new Date(batch.expiryDate);
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
          return expiryDate <= thirtyDaysFromNow;
        });

        return {
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
      });

      return NextResponse.json({
        products: enrichedProducts,
        total: enrichedProducts.length,
        query,
        found: enrichedProducts.length > 0,
      });
    } catch (error) {
      console.error("Error searching products:", error);
      return NextResponse.json(
        { error: "Failed to search products" },
        { status: 500 }
      );
    }
  });
}