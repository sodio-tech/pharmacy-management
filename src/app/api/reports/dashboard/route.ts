import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/rbac";

// GET /api/reports/dashboard - Get dashboard statistics
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // Get current month sales
    const currentMonthSales = await prisma.sale.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: startOfMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });

    // Get last month sales for comparison
    const lastMonthSales = await prisma.sale.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: lastMonth,
          lt: startOfMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    // Get today's orders
    const todayOrders = await prisma.sale.count({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: new Date(today.toDateString()),
        },
      },
    });

    // Get yesterday's orders for comparison
    const yesterdayOrders = await prisma.sale.count({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: new Date(yesterday.toDateString()),
          lt: new Date(today.toDateString()),
        },
      },
    });

    // Get low stock items
    const lowStockItems = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        reorderLevel: true,
        batches: {
          select: {
            quantity: true,
          },
          where: {
            quantity: { gt: 0 },
          },
        },
      },
    });

    const lowStockProducts = lowStockItems
      .map(product => {
        const totalStock = product.batches.reduce((sum, batch) => sum + batch.quantity, 0);
        return {
          ...product,
          totalStock,
          isLowStock: totalStock <= product.reorderLevel,
        };
      })
      .filter(product => product.isLowStock);

    // Get expiring items (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringBatches = await prisma.batch.findMany({
      where: {
        expiryDate: {
          lte: thirtyDaysFromNow,
          gte: today,
        },
        quantity: { gt: 0 },
      },
      select: {
        id: true,
        batchNumber: true,
        expiryDate: true,
        quantity: true,
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
      orderBy: {
        expiryDate: "asc",
      },
    });

    const expiringItemsCount = expiringBatches.reduce((sum, batch) => sum + batch.quantity, 0);

    // Get recent prescriptions
    const recentPrescriptions = await prisma.prescription.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        patientName: true,
        status: true,
        createdAt: true,
        sales: {
          select: {
            totalAmount: true,
          },
        },
      },
    });

    // Calculate revenue change percentage
    const currentRevenue = currentMonthSales._sum.totalAmount || 0;
    const lastRevenue = lastMonthSales._sum.totalAmount || 0;
    const revenueChange = lastRevenue > 0
      ? ((currentRevenue - lastRevenue) / lastRevenue) * 100
      : 0;

    // Calculate orders change percentage
    const ordersChange = yesterdayOrders > 0
      ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100
      : 0;

    // Top selling products (current month)
    const topProducts = await prisma.saleItem.groupBy({
      by: ['productId'],
      where: {
        sale: {
          status: "COMPLETED",
          createdAt: {
            gte: startOfMonth,
          },
        },
      },
      _sum: {
        quantity: true, // only sum the quantity from saleItem
        // remove totalAmount here to avoid ambiguity
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    // Get product details and calculate revenue from sales
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, sku: true },
        });

        // Sum revenue from sale items linked to this product for the month
        const revenueAgg = await prisma.saleItem.aggregate({
          _sum: { totalAmount: true },
          where: {
            productId: item.productId,
            sale: {
              status: "COMPLETED",
              createdAt: { gte: startOfMonth },
            },
          },
        });

        return {
          ...product,
          quantitySold: item._sum.quantity,
          revenue: revenueAgg._sum.totalAmount || 0,
        };
      })
    );


    return NextResponse.json({
      kpis: {
        totalRevenue: {
          value: currentRevenue,
          change: revenueChange,
          trend: revenueChange >= 0 ? "up" : "down",
        },
        ordersToday: {
          value: todayOrders,
          change: ordersChange,
          trend: ordersChange >= 0 ? "up" : "down",
        },
        lowStockItems: {
          value: lowStockProducts.length,
          items: lowStockProducts.slice(0, 5),
        },
        expiringItems: {
          value: expiringItemsCount,
          batches: expiringBatches.slice(0, 5),
        },
      },
      recentPrescriptions: recentPrescriptions.map(prescription => ({
        ...prescription,
        amount: prescription.sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
        itemCount: prescription.sales.length,
      })),
      topProducts: topProductsWithDetails,
      summary: {
        totalProducts: await prisma.product.count(),
        totalPrescriptions: await prisma.prescription.count(),
        completedSalesThisMonth: currentMonthSales._count.id,
        pendingPrescriptions: await prisma.prescription.count({
          where: { status: "PENDING_VALIDATION" },
        }),
      },
    });
  });
}