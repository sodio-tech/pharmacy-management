import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, UserRole } from "@/lib/rbac";
import { z } from "zod";

const createSaleSchema = z.object({
  customerId: z.string().uuid().optional(),
  customerName: z.string().min(2).max(100).optional(),
  customerPhone: z.string().min(10).max(15).optional(),
  prescriptionId: z.string().uuid().optional(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    batchId: z.string().uuid().optional(),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
  })).min(1),
  paymentMethod: z.string().default("CASH"),
  discount: z.number().min(0).default(0),
});

const getSalesSchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("20"),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
});

// GET /api/sales - List sales
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    const { searchParams } = new URL(req.url);
    const params = getSalesSchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      status: searchParams.get("status"),
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
      search: searchParams.get("search"),
    });

    const page = parseInt(params.page);
    const limit = parseInt(params.limit);
    const offset = (page - 1) * limit;

    const where: any = {};
    
    if (params.status) {
      where.status = params.status;
    }
    
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) {
        where.createdAt.gte = new Date(params.startDate);
      }
      if (params.endDate) {
        const endDate = new Date(params.endDate);
        endDate.setHours(23, 59, 59, 999); // End of day
        where.createdAt.lte = endDate;
      }
    }
    
    if (params.search) {
      where.OR = [
        { saleNumber: { contains: params.search, mode: "insensitive" } },
        { customerName: { contains: params.search, mode: "insensitive" } },
        { customerPhone: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        select: {
          id: true,
          saleNumber: true,
          customerName: true,
          customerPhone: true,
          subtotal: true,
          gstAmount: true,
          discount: true,
          totalAmount: true,
          paymentMethod: true,
          status: true,
          createdAt: true,
          soldByUser: {
            select: {
              id: true,
              name: true,
            },
          },
          prescription: {
            select: {
              id: true,
              patientName: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.sale.count({ where }),
    ]);

    return NextResponse.json({
      sales,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });
}

// POST /api/sales - Create new sale
export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      const body = await req.json();
      const saleData = createSaleSchema.parse(body);

      // Generate sale number
      const saleCount = await prisma.sale.count();
      const saleNumber = `SALE-${new Date().getFullYear()}-${String(saleCount + 1).padStart(6, '0')}`;

      // Validate prescription if provided
      if (saleData.prescriptionId) {
        const prescription = await prisma.prescription.findUnique({
          where: { id: saleData.prescriptionId },
          select: { id: true, status: true, patientName: true },
        });

        if (!prescription) {
          return NextResponse.json(
            { error: "Prescription not found" },
            { status: 404 }
          );
        }

        if (prescription.status !== "VALIDATED") {
          return NextResponse.json(
            { error: "Prescription must be validated before creating sale" },
            { status: 400 }
          );
        }

        // Use patient name as customer name if not provided
        if (!saleData.customerName) {
          saleData.customerName = prescription.patientName;
        }
      }

      // Validate products and calculate totals
      let subtotal = 0;
      let gstAmount = 0;
      const saleItems = [];

      for (const item of saleData.items) {
        // Get product details
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            gstRate: true,
            batches: {
              select: {
                id: true,
                quantity: true,
                sellingPrice: true,
              },
              where: item.batchId ? { id: item.batchId } : { quantity: { gt: 0 } },
              orderBy: { expiryDate: "asc" },
            },
          },
        });

        if (!product) {
          return NextResponse.json(
            { error: `Product not found: ${item.productId}` },
            { status: 404 }
          );
        }

        // Find appropriate batch
        let selectedBatch = item.batchId 
          ? product.batches.find(b => b.id === item.batchId)
          : product.batches[0]; // Use earliest expiry batch

        if (!selectedBatch) {
          return NextResponse.json(
            { error: `No available stock for product: ${product.name}` },
            { status: 400 }
          );
        }

        if (selectedBatch.quantity < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for product: ${product.name}. Available: ${selectedBatch.quantity}` },
            { status: 400 }
          );
        }

        // Calculate amounts
        const unitPrice = item.unitPrice || selectedBatch.sellingPrice;
        const itemSubtotal = unitPrice * item.quantity;
        const itemGstAmount = (itemSubtotal * product.gstRate) / 100;

        subtotal += itemSubtotal;
        gstAmount += itemGstAmount;

        saleItems.push({
          productId: item.productId,
          batchId: selectedBatch.id,
          quantity: item.quantity,
          unitPrice,
          gstRate: product.gstRate,
          gstAmount: itemGstAmount,
          totalAmount: itemSubtotal + itemGstAmount,
        });
      }

      const totalAmount = subtotal + gstAmount - saleData.discount;

      // Create sale transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create sale
        const sale = await tx.sale.create({
          data: {
            saleNumber,
            customerId: saleData.customerId,
            customerName: saleData.customerName,
            customerPhone: saleData.customerPhone,
            prescriptionId: saleData.prescriptionId,
            soldBy: user.id,
            subtotal,
            gstAmount,
            discount: saleData.discount,
            totalAmount,
            paymentMethod: saleData.paymentMethod,
            status: "COMPLETED",
          },
        });

        // Create sale items and update stock
        for (const item of saleItems) {
          await tx.saleItem.create({
            data: {
              saleId: sale.id,
              ...item,
            },
          });

          // Update batch quantity
          await tx.batch.update({
            where: { id: item.batchId },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
        }

        return sale;
      });

      // Get complete sale with items
      const completeSale = await prisma.sale.findUnique({
        where: { id: result.id },
        select: {
          id: true,
          saleNumber: true,
          customerName: true,
          customerPhone: true,
          subtotal: true,
          gstAmount: true,
          discount: true,
          totalAmount: true,
          paymentMethod: true,
          status: true,
          createdAt: true,
          items: {
            select: {
              quantity: true,
              unitPrice: true,
              totalAmount: true,
              product: {
                select: {
                  name: true,
                  unit: true,
                },
              },
            },
          },
        },
      });

      return NextResponse.json({ 
        message: "Sale completed successfully",
        sale: completeSale 
      }, { status: 201 });
    },
    [UserRole.ADMIN, UserRole.PHARMACIST]
  );
}