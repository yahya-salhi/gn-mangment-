/*
  Warnings:

  - Added the required column `referenceDate` to the `EquipmentReception` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceNumber` to the `EquipmentReception` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EquipmentReception" ADD COLUMN     "reference" TEXT,
ADD COLUMN     "referenceDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "referenceNumber" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "EquipmentDelivery" (
    "id" SERIAL NOT NULL,
    "equipmentName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "beneficiaryUnit" TEXT NOT NULL,
    "beneficiary" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "deliveredBy" INTEGER NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "referenceDate" TIMESTAMP(3) NOT NULL,
    "warehouseManager" TEXT NOT NULL,
    "unitHead" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentDelivery_pkey" PRIMARY KEY ("id")
);
