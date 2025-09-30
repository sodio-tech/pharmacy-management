import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, UserRole } from "@/lib/rbac";
import { z } from "zod";

const generateAlertsSchema = z.object({
  forceRefresh: z.string().optional().default("false"),
});

// GET /api/alerts/low-stock - Get low stock alerts
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    const { searchParams } = new URL(req.url);
    const params = generateAlertsSchema.parse({
      forceRefresh: searchParams.get("forceRefresh"),
    });

    // Get all products with their current stock levels
    const products = await prisma.product.findMany({
      select: {
        id: true,
        sku: true,
        name: true,
        unit: true,
        reorderLevel: true,
        price: true,
        category: true,
        batches: {
          select: {
            quantity: true,
            expiryDate: true,
          },
          where: { quantity: { gt: 0 } },
        },
      },
    });

    const alerts = [];
    
    for (const product of products) {
      const totalStock = product.batches.reduce((sum, batch) => sum + batch.quantity, 0);
      
      if (totalStock <= product.reorderLevel) {
        // Calculate suggested reorder quantity (2x reorder level or minimum 50)
        const suggestedQty = Math.max(product.reorderLevel * 2, 50);
        
        // Check expiring stock (within 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        const expiringSoonStock = product.batches
          .filter(batch => new Date(batch.expiryDate) <= thirtyDaysFromNow)
          .reduce((sum, batch) => sum + batch.quantity, 0);

        // Determine priority based on stock level
        let priority = "MEDIUM";
        if (totalStock === 0) {
          priority = "HIGH";
        } else if (totalStock <= product.reorderLevel * 0.5) {
          priority = "HIGH";
        } else if (totalStock > product.reorderLevel * 0.8) {
          priority = "LOW";
        }

        alerts.push({
          productId: product.id,
          sku: product.sku,
          name: product.name,
          unit: product.unit,
          currentStock: totalStock,
          reorderLevel: product.reorderLevel,
          suggestedQty,
          priority,
          category: product.category,
          price: product.price,
          expiringSoonStock,
          stockStatus: totalStock === 0 ? "OUT_OF_STOCK" : "LOW_STOCK",
          daysToStockout: totalStock === 0 ? 0 : Math.ceil(totalStock / 5), // Assuming 5 units per day average usage
        });
      }
    }

    // Sort by priority (HIGH > MEDIUM > LOW) and then by stock level
    const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    alerts.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return a.currentStock - b.currentStock;
    });

    // If forceRefresh is true, also update the reorder suggestions in database
    if (params.forceRefresh === "true") {
      // Clear existing suggestions
      await prisma.reorderSuggestion.deleteMany({
        where: { isProcessed: false }
      });

      // Create new suggestions
      const suggestions = alerts.map(alert => ({
        productId: alert.productId,
        currentStock: alert.currentStock,
        reorderLevel: alert.reorderLevel,
        suggestedQty: alert.suggestedQty,
        priority: alert.priority,
        isProcessed: false,
      }));

      if (suggestions.length > 0) {
        await prisma.reorderSuggestion.createMany({
          data: suggestions,
        });
      }
    }

    const summary = {
      totalAlerts: alerts.length,
      highPriority: alerts.filter(a => a.priority === "HIGH").length,
      mediumPriority: alerts.filter(a => a.priority === "MEDIUM").length,
      lowPriority: alerts.filter(a => a.priority === "LOW").length,
      outOfStock: alerts.filter(a => a.stockStatus === "OUT_OF_STOCK").length,
    };

    return NextResponse.json({
      summary,
      alerts,
      generatedAt: new Date().toISOString(),
    });
  });
}

// POST /api/alerts/low-stock - Mark alert as processed or generate manual alert
export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      const body = await req.json();
      const { productId, action } = body;

      if (action === "mark_processed" && productId) {
        // Mark reorder suggestion as processed
        await prisma.reorderSuggestion.updateMany({
          where: { 
            productId,
            isProcessed: false 
          },
          data: { isProcessed: true },
        });

        return NextResponse.json({ 
          message: "Alert marked as processed" 
        });
      }

      return NextResponse.json(
        { error: "Invalid action or missing productId" },
        { status: 400 }
      );
    },
    [UserRole.ADMIN, UserRole.PHARMACIST]
  );
}