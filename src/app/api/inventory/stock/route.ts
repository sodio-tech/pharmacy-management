import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/rbac";
import { z } from "zod";

const getStockSchema = z.object({
  productId: z.string().uuid().optional(),
  lowStock: z.string().optional(),
  expiringSoon: z.string().optional(),
});

// GET /api/inventory/stock - Get stock levels and alerts
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    const { searchParams } = new URL(req.url);
    const params = getStockSchema.parse({
      productId: searchParams.get("productId"),
      lowStock: searchParams.get("lowStock"),
      expiringSoon: searchParams.get("expiringSoon"),
    });

    // If specific product requested
    if (params.productId) {
      const product = await prisma.product.findUnique({
        where: { id: params.productId },
        select: {
          id: true,
          sku: true,
          name: true,
          reorderLevel: true,
          batches: {
            select: {
              id: true,
              batchNumber: true,
              quantity: true,
              expiryDate: true,
              sellingPrice: true,
            },
            where: { quantity: { gt: 0 } },
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

      const totalStock = product.batches.reduce((sum, batch) => sum + batch.quantity, 0);
      
      return NextResponse.json({
        product: {
          ...product,
          totalStock,
          isLowStock: totalStock <= product.reorderLevel,
        },
      });
    }

    // Get stock summary for all products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        sku: true,
        name: true,
        unit: true,
        reorderLevel: true,
        batches: {
          select: {
            quantity: true,
            expiryDate: true,
          },
          where: { quantity: { gt: 0 } },
        },
      },
    });

    const stockSummary = products.map(product => {
      const totalStock = product.batches.reduce((sum, batch) => sum + batch.quantity, 0);
      
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const expiringSoonBatches = product.batches.filter(
        batch => new Date(batch.expiryDate) <= thirtyDaysFromNow
      );
      
      const expiringSoonStock = expiringSoonBatches.reduce((sum, batch) => sum + batch.quantity, 0);
      
      return {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        unit: product.unit,
        totalStock,
        reorderLevel: product.reorderLevel,
        isLowStock: totalStock <= product.reorderLevel,
        expiringSoonStock,
        isExpiringSoon: expiringSoonStock > 0,
      };
    });

    // Apply filters
    let filteredStock = stockSummary;
    
    if (params.lowStock === "true") {
      filteredStock = filteredStock.filter(item => item.isLowStock);
    }
    
    if (params.expiringSoon === "true") {
      filteredStock = filteredStock.filter(item => item.isExpiringSoon);
    }

    // Calculate summary statistics
    const summary = {
      totalProducts: products.length,
      lowStockCount: stockSummary.filter(item => item.isLowStock).length,
      expiringSoonCount: stockSummary.filter(item => item.isExpiringSoon).length,
      totalStockValue: stockSummary.reduce((sum, item) => sum + item.totalStock, 0),
    };

    return NextResponse.json({
      summary,
      products: filteredStock,
    });
  });
}