import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/rbac";

// GET /api/inventory/stock - Get inventory summary and real-time stock data
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      // Get all products with their batches
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          sku: true,
          category: true,
          price: true,
          reorderLevel: true,
          batches: {
            select: {
              id: true,
              quantity: true,
              expiryDate: true,
              costPrice: true,
            },
            where: {
              quantity: { gt: 0 }, // Only active batches
            },
          },
        },
      });

      // Calculate summary statistics
      let totalProducts = products.length;
      let lowStockCount = 0;
      let outOfStockCount = 0;
      let expiringSoonCount = 0;
      let totalStockValue = 0;
      let totalStockUnits = 0;

      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      products.forEach(product => {
        const totalStock = product.batches.reduce((sum, batch) => sum + batch.quantity, 0);
        const stockValue = product.batches.reduce((sum, batch) => sum + (batch.quantity * batch.costPrice), 0);
        
        totalStockUnits += totalStock;
        totalStockValue += stockValue;

        // Check stock levels
        if (totalStock === 0) {
          outOfStockCount++;
        } else if (totalStock <= product.reorderLevel) {
          lowStockCount++;
        }

        // Check expiring batches
        const expiringBatches = product.batches.filter(batch => {
          const expiryDate = new Date(batch.expiryDate);
          return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
        });

        if (expiringBatches.length > 0) {
          expiringSoonCount++;
        }
      });

      // Get low stock products for alerts
      const lowStockProducts = products
        .map(product => {
          const totalStock = product.batches.reduce((sum, batch) => sum + batch.quantity, 0);
          return {
            ...product,
            totalStock,
            isLowStock: totalStock <= product.reorderLevel,
            isOutOfStock: totalStock === 0,
          };
        })
        .filter(product => product.isLowStock || product.isOutOfStock)
        .sort((a, b) => a.totalStock - b.totalStock);

      // Get expiring products
      const expiringProducts = products
        .map(product => {
          const expiringBatches = product.batches.filter(batch => {
            const expiryDate = new Date(batch.expiryDate);
            return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
          });
          
          return {
            ...product,
            totalStock: product.batches.reduce((sum, batch) => sum + batch.quantity, 0),
            expiringBatches,
            nearestExpiry: expiringBatches.length > 0 
              ? new Date(Math.min(...expiringBatches.map(b => new Date(b.expiryDate).getTime())))
              : null,
          };
        })
        .filter(product => product.expiringBatches.length > 0)
        .sort((a, b) => {
          if (!a.nearestExpiry || !b.nearestExpiry) return 0;
          return a.nearestExpiry.getTime() - b.nearestExpiry.getTime();
        });

      // Get recent stock movements (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentMovements = await prisma.saleItem.findMany({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
        select: {
          id: true,
          quantity: true,
          createdAt: true,
          product: {
            select: {
              name: true,
              sku: true,
            },
          },
          sale: {
            select: {
              saleNumber: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      });

      // Calculate stock turnover rate (simplified)
      const totalSalesQuantity = recentMovements.reduce((sum, item) => sum + item.quantity, 0);
      const averageStock = totalStockUnits / Math.max(totalProducts, 1);
      const turnoverRate = averageStock > 0 ? (totalSalesQuantity / 7) / averageStock : 0; // Daily turnover rate

      return NextResponse.json({
        summary: {
          totalProducts,
          lowStockCount,
          outOfStockCount,
          expiringSoonCount,
          totalStockValue: Math.round(totalStockValue),
          totalStockUnits,
          turnoverRate: Math.round(turnoverRate * 100) / 100,
        },
        alerts: {
          lowStockProducts: lowStockProducts.slice(0, 10), // Top 10 low stock items
          expiringProducts: expiringProducts.slice(0, 10), // Top 10 expiring items
        },
        recentMovements,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error fetching inventory stock data:", error);
      return NextResponse.json(
        { error: "Failed to fetch inventory data" },
        { status: 500 }
      );
    }
  });
}