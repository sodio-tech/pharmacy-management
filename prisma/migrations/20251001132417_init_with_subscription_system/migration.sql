-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('PHARMACIST', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."SubscriptionTier" AS ENUM ('FREE', 'PREMIUM', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."PrescriptionStatus" AS ENUM ('UPLOADED', 'PENDING_VALIDATION', 'VALIDATED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."SaleStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneNumber" TEXT NOT NULL,
    "pharmacyName" TEXT NOT NULL,
    "drugLicenseNumber" TEXT NOT NULL,
    "image" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'PHARMACIST',
    "subscriptionTier" "public"."SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT,
    "specialization" TEXT,
    "address" TEXT,
    "licenseNumber" TEXT,
    "qualifications" TEXT,
    "experience" INTEGER,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" "public"."SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "maxAdmins" INTEGER NOT NULL DEFAULT 1,
    "maxPharmacists" INTEGER NOT NULL DEFAULT 1,
    "currentAdmins" INTEGER NOT NULL DEFAULT 0,
    "currentPharmacists" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "gstNumber" TEXT,
    "contactPerson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "unit" TEXT NOT NULL,
    "hsnCode" TEXT,
    "gstRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL,
    "reorderLevel" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."batch" (
    "id" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "mfgDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "costPrice" DOUBLE PRECISION NOT NULL,
    "sellingPrice" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."prescription" (
    "id" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "patientPhone" TEXT,
    "patientAge" INTEGER,
    "doctorName" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "validatedBy" TEXT,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "extractedText" TEXT,
    "status" "public"."PrescriptionStatus" NOT NULL DEFAULT 'UPLOADED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."prescription_item" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "productId" TEXT,
    "medichineName" TEXT NOT NULL,
    "dosage" TEXT,
    "quantity" INTEGER,
    "instructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescription_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sale" (
    "id" TEXT NOT NULL,
    "saleNumber" TEXT NOT NULL,
    "customerId" TEXT,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "prescriptionId" TEXT,
    "soldBy" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "gstAmount" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'CASH',
    "status" "public"."SaleStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sale_item" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "batchId" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "gstRate" DOUBLE PRECISION NOT NULL,
    "gstAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sale_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reorder_suggestion" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "currentStock" INTEGER NOT NULL,
    "reorderLevel" INTEGER NOT NULL,
    "suggestedQty" INTEGER NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reorder_suggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profile_userId_key" ON "public"."profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_userId_key" ON "public"."subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "product_sku_key" ON "public"."product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "batch_batchNumber_productId_key" ON "public"."batch"("batchNumber", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "sale_saleNumber_key" ON "public"."sale"("saleNumber");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token");

-- AddForeignKey
ALTER TABLE "public"."profile" ADD CONSTRAINT "profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscription" ADD CONSTRAINT "subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."batch" ADD CONSTRAINT "batch_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."batch" ADD CONSTRAINT "batch_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prescription" ADD CONSTRAINT "prescription_validatedBy_fkey" FOREIGN KEY ("validatedBy") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prescription_item" ADD CONSTRAINT "prescription_item_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "public"."prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prescription_item" ADD CONSTRAINT "prescription_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sale" ADD CONSTRAINT "sale_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "public"."prescription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sale" ADD CONSTRAINT "sale_soldBy_fkey" FOREIGN KEY ("soldBy") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sale_item" ADD CONSTRAINT "sale_item_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "public"."sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sale_item" ADD CONSTRAINT "sale_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sale_item" ADD CONSTRAINT "sale_item_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
