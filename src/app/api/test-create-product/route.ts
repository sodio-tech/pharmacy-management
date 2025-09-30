import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Test endpoint to create products without auth
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const product = await prisma.product.create({
      data: {
        sku: body.sku || `TEST${Date.now()}`,
        name: body.name || "Test Product",
        description: body.description || "",
        category: body.category || "OTC",
        unit: body.unit || "tablets",
        hsnCode: body.hsnCode || "",
        gstRate: body.gstRate || 12,
        price: body.price || 10.0,
        reorderLevel: body.reorderLevel || 10,
      },
    });

    return NextResponse.json({
      message: "Product created successfully",
      product: {
        id: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}