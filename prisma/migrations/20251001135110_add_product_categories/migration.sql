/*
  Warnings:

  - The `category` column on the `product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."ProductCategory" AS ENUM ('OTC', 'PRESCRIPTION', 'SUPPLEMENT', 'MEDICAL_DEVICE', 'PERSONAL_CARE', 'BABY_CARE', 'FIRST_AID', 'AYURVEDIC');

-- AlterTable
ALTER TABLE "public"."product" DROP COLUMN "category",
ADD COLUMN     "category" "public"."ProductCategory" NOT NULL DEFAULT 'OTC';
