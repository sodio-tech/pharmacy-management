/*
  Warnings:

  - Added the required column `drugLicenseNumber` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pharmacyName` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "drugLicenseNumber" TEXT NOT NULL,
ADD COLUMN     "pharmacyName" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ALTER COLUMN "emailVerified" SET DEFAULT false,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
