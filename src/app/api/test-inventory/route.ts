import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Test endpoint to check if our data is working without auth
export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      include: {
        batches: {
          include: {
            supplier: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Database connection successful",
      products: products.map(product => ({
        id: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
        totalBatches: product.batches.length,
        totalStock: product.batches.reduce((sum, batch) => sum + batch.quantity, 0),
      })),
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }
}