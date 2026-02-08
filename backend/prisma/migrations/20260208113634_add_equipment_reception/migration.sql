-- CreateTable
CREATE TABLE "EquipmentReception" (
    "id" SERIAL NOT NULL,
    "equipmentName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "minimumThreshold" INTEGER NOT NULL,
    "sendingDept" TEXT NOT NULL,
    "receptionDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentReception_pkey" PRIMARY KEY ("id")
);
