import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/rbac";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().min(1),
  category: z.enum(["OTC", "PRESCRIPTION", "SUPPLEMENT"]).optional(),
  limit: z.string().optional().default("10"),
});

// GET /api/products/search - Search products by name, SKU, or barcode
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    const { searchParams } = new URL(req.url);
    const params = searchSchema.parse({
      q: searchParams.get("q"),
      category: searchParams.get("category"),
      limit: searchParams.get("limit"),
    });

    const limit = parseInt(params.limit);

    const where: any = {
      OR: [
        { name: { contains: params.q, mode: "insensitive" } },
        { sku: { contains: params.q, mode: "insensitive" } },
      ],
    };

    if (params.category) {
      where.category = params.category;
    }

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        sku: true,
        name: true,
        category: true,
        unit: true,
        price: true,
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
      take: limit,
      orderBy: [
        { name: "asc" },
      ],
    });

    // Add stock information
    const enrichedProducts = products.map(product => ({
      ...product,
      totalStock: product.batches.reduce((sum, batch) => sum + batch.quantity, 0),
      availableBatches: product.batches.length,
    }));

    return NextResponse.json({
      products: enrichedProducts,
      count: enrichedProducts.length,
    });
  });
}