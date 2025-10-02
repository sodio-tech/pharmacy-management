import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, UserRole } from "@/lib/rbac";
import { z } from "zod";

const createProductSchema = z.object({
  sku: z.string().min(3).max(50),
  name: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  category: z.enum(["OTC", "PRESCRIPTION", "SUPPLEMENT", "MEDICAL_DEVICE", "PERSONAL_CARE", "BABY_CARE", "FIRST_AID", "AYURVEDIC"]),
  unit: z.string().min(1).max(20),
  hsnCode: z.string().max(20).optional(),
  gstRate: z.number().min(0).max(100).default(0),
  price: z.number().min(0),
  reorderLevel: z.number().min(0).default(10),
});

const getProductsSchema = z.object({
  page: z.string().default("1"),
  limit: z.string().default("20"),
  category: z.enum(["OTC", "PRESCRIPTION", "SUPPLEMENT", "MEDICAL_DEVICE", "PERSONAL_CARE", "BABY_CARE", "FIRST_AID", "AYURVEDIC"]).optional(),
  search: z.string().optional(),
  lowStock: z.string().optional(),
  expiringSoon: z.string().optional(),
});

// GET /api/products - List products with filtering
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    const { searchParams } = new URL(req.url);
    const params = getProductsSchema.parse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
      lowStock: searchParams.get("lowStock") || undefined,
      expiringSoon: searchParams.get("expiringSoon") || undefined,
    });

    const page = parseInt(params.page);
    const limit = parseInt(params.limit);
    const offset = (page - 1) * limit;

    const where: any = {};
    
    if (params.category) {
      where.category = params.category;
    }
    
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { sku: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
      ];
    }

    // Build the query to include stock calculations
    const productsQuery = {
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
          },
          where: {
            quantity: { gt: 0 },
          },
        },
      },
      orderBy: { name: "asc" as const },
      skip: offset,
      take: limit,
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany(productsQuery),
      prisma.product.count({ where }),
    ]);

    // Calculate stock levels and apply filters
    const enrichedProducts = products
      .map(product => {
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
          expiringSoonCount: expiringSoonBatches.length,
          expiringSoonStock: expiringSoonBatches.reduce((sum, batch) => sum + batch.quantity, 0),
        };
      })
      .filter(product => {
        if (params.lowStock === "true" && !product.isLowStock) return false;
        if (params.expiringSoon === "true" && product.expiringSoonCount === 0) return false;
        return true;
      });

    return NextResponse.json({
      products: enrichedProducts,
      pagination: {
        page,
        limit,
        total: enrichedProducts.length,
        totalPages: Math.ceil(enrichedProducts.length / limit),
      },
    });
  });
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      const body = await req.json();
      
      // Ensure category is properly formatted
      if (body.category) {
        body.category = body.category.trim().toUpperCase();
      }
      
      const productData = createProductSchema.parse(body);

      // Check if SKU already exists
      const existingProduct = await prisma.product.findUnique({
        where: { sku: productData.sku },
      });

      if (existingProduct) {
        return NextResponse.json(
          { error: "Product with this SKU already exists" },
          { status: 400 }
        );
      }

      // Check free tier limits
      const { checkProductLimit } = await import("@/lib/subscription");
      const canAddProduct = await checkProductLimit(user.id);
      
      if (!canAddProduct) {
        return NextResponse.json(
          { 
            error: "Product limit exceeded for current subscription tier. Upgrade to add more products.",
            limitReached: true,
            currentTier: "FREE",
            maxProducts: 20
          },
          { status: 403 }
        );
      }

      const product = await prisma.product.create({
        data: productData,
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
        },
      });

      return NextResponse.json({
        message: "Product created successfully",
        product
      }, { status: 201 });
    },
    [UserRole.ADMIN, UserRole.PHARMACIST]
  );
}