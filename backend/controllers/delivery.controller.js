import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Equipment Delivery
export const createEquipmentDelivery = async (req, res) => {
  try {
    const {
      equipmentName,
      category,
      quantity,
      beneficiaryUnit,
      beneficiary,
      receiver,
      deliveryDate,
      referenceNumber,
      referenceDate,
      warehouseManager,
      unitHead,
      notes,
    } = req.body;

    const deliveredBy = req.user.id; // المسلم هو المستخدم الحالي

    // Validate required fields
    if (
      !equipmentName ||
      !category ||
      !quantity ||
      !beneficiaryUnit ||
      !beneficiary ||
      !receiver ||
      !deliveryDate ||
      !referenceNumber ||
      !referenceDate ||
      !warehouseManager ||
      !unitHead
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
        required: [
          "equipmentName",
          "category",
          "quantity",
          "beneficiaryUnit",
          "beneficiary",
          "receiver",
          "deliveryDate",
          "referenceNumber",
          "referenceDate",
          "warehouseManager",
          "unitHead",
        ],
      });
    }

    // التحقق من أن warehouseManager موجود ولديه صلاحيات Manager
    const managerUser = await prisma.user.findFirst({
      where: {
        name: warehouseManager,
        role: "MANAGER",
      },
    });

    if (!managerUser) {
      return res.status(400).json({
        message: "Warehouse manager must be a user with MANAGER role",
        hint: "Make sure the warehouse manager name matches a Manager user in the system",
      });
    }

    const delivery = await prisma.equipmentDelivery.create({
      data: {
        equipmentName,
        category,
        quantity: parseInt(quantity),
        beneficiaryUnit,
        beneficiary,
        receiver,
        deliveredBy,
        deliveryDate: new Date(deliveryDate),
        referenceNumber,
        referenceDate: new Date(referenceDate),
        warehouseManager,
        unitHead,
        notes: notes || null,
      },
    });

    console.log(`✅ Equipment delivered:`, {
      id: delivery.id,
      equipment: delivery.equipmentName,
      to: delivery.beneficiary,
      quantity: delivery.quantity,
    });

    return res.status(201).json({
      message: "Equipment delivery recorded successfully",
      data: delivery,
    });
  } catch (error) {
    console.error("Create delivery error:", error);
    return res.status(500).json({
      message: "Failed to create equipment delivery",
      error: error.message,
    });
  }
};

// Get All Equipment Deliveries
export const getAllEquipmentDeliveries = async (req, res) => {
  try {
    const deliveries = await prisma.equipmentDelivery.findMany({
      orderBy: { createdAt: "desc" },
    });

    // اضافة معلومات المسلم (deliveredBy user)
    const deliveriesWithUsers = await Promise.all(
      deliveries.map(async (delivery) => {
        const user = await prisma.user.findUnique({
          where: { id: delivery.deliveredBy },
          select: { id: true, name: true, email: true, role: true },
        });
        return {
          ...delivery,
          deliveredByUser: user,
        };
      })
    );

    console.log(`✅ Retrieved ${deliveries.length} delivery records`);

    return res.status(200).json({
      message: "Equipment deliveries retrieved successfully",
      data: deliveriesWithUsers,
      count: deliveries.length,
    });
  } catch (error) {
    console.error("Get deliveries error:", error);
    return res.status(500).json({
      message: "Failed to retrieve equipment deliveries",
    });
  }
};

// Get Equipment Delivery By ID
export const getEquipmentDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await prisma.equipmentDelivery.findUnique({
      where: { id: parseInt(id) },
    });

    if (!delivery) {
      return res.status(404).json({ message: "Equipment delivery not found" });
    }

    // جلب معلومات المستخدم الذي سلم
    const user = await prisma.user.findUnique({
      where: { id: delivery.deliveredBy },
      select: { id: true, name: true, email: true, role: true },
    });

    console.log(`✅ Retrieved delivery:`, {
      id: delivery.id,
      equipment: delivery.equipmentName,
    });

    return res.status(200).json({
      message: "Equipment delivery retrieved successfully",
      data: {
        ...delivery,
        deliveredByUser: user,
      },
    });
  } catch (error) {
    console.error("Get delivery error:", error);
    return res.status(500).json({
      message: "Failed to retrieve equipment delivery",
    });
  }
};

// Update Equipment Delivery
export const updateEquipmentDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      equipmentName,
      category,
      quantity,
      beneficiaryUnit,
      beneficiary,
      receiver,
      deliveryDate,
      referenceNumber,
      referenceDate,
      warehouseManager,
      unitHead,
      notes,
    } = req.body;

    const delivery = await prisma.equipmentDelivery.findUnique({
      where: { id: parseInt(id) },
    });

    if (!delivery) {
      return res.status(404).json({ message: "Equipment delivery not found" });
    }

    // إذا تم تحديث warehouseManager، تحقق من أنه Manager
    if (warehouseManager && warehouseManager !== delivery.warehouseManager) {
      const managerUser = await prisma.user.findFirst({
        where: {
          name: warehouseManager,
          role: "MANAGER",
        },
      });

      if (!managerUser) {
        return res.status(400).json({
          message: "Warehouse manager must be a user with MANAGER role",
        });
      }
    }

    const updatedDelivery = await prisma.equipmentDelivery.update({
      where: { id: parseInt(id) },
      data: {
        equipmentName: equipmentName || delivery.equipmentName,
        category: category || delivery.category,
        quantity: quantity ? parseInt(quantity) : delivery.quantity,
        beneficiaryUnit: beneficiaryUnit || delivery.beneficiaryUnit,
        beneficiary: beneficiary || delivery.beneficiary,
        receiver: receiver || delivery.receiver,
        deliveryDate: deliveryDate
          ? new Date(deliveryDate)
          : delivery.deliveryDate,
        referenceNumber: referenceNumber || delivery.referenceNumber,
        referenceDate: referenceDate
          ? new Date(referenceDate)
          : delivery.referenceDate,
        warehouseManager: warehouseManager || delivery.warehouseManager,
        unitHead: unitHead || delivery.unitHead,
        notes: notes !== undefined ? notes : delivery.notes,
      },
    });

    console.log(`✅ Delivery updated:`, {
      id: updatedDelivery.id,
      equipment: updatedDelivery.equipmentName,
    });

    return res.status(200).json({
      message: "Equipment delivery updated successfully",
      data: updatedDelivery,
    });
  } catch (error) {
    console.error("Update delivery error:", error);
    return res.status(500).json({
      message: "Failed to update equipment delivery",
    });
  }
};

// Delete Equipment Delivery
export const deleteEquipmentDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await prisma.equipmentDelivery.findUnique({
      where: { id: parseInt(id) },
    });

    if (!delivery) {
      return res.status(404).json({ message: "Equipment delivery not found" });
    }

    await prisma.equipmentDelivery.delete({
      where: { id: parseInt(id) },
    });

    console.log(`✅ Delivery deleted:`, {
      id,
      equipment: delivery.equipmentName,
    });

    return res.status(200).json({
      message: "Equipment delivery deleted successfully",
      data: { id: delivery.id },
    });
  } catch (error) {
    console.error("Delete delivery error:", error);
    return res.status(500).json({
      message: "Failed to delete equipment delivery",
    });
  }
};

// Get Deliveries by Beneficiary Unit
export const getDeliveriesByUnit = async (req, res) => {
  try {
    const { unit } = req.params;

    const deliveries = await prisma.equipmentDelivery.findMany({
      where: { beneficiaryUnit: unit },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "Deliveries retrieved by unit",
      data: deliveries,
      count: deliveries.length,
    });
  } catch (error) {
    console.error("Get deliveries by unit error:", error);
    return res.status(500).json({
      message: "Failed to retrieve deliveries by unit",
    });
  }
};

// Get Deliveries by Date Range
export const getDeliveriesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Start date and end date are required",
      });
    }

    const deliveries = await prisma.equipmentDelivery.findMany({
      where: {
        deliveryDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: { deliveryDate: "desc" },
    });

    return res.status(200).json({
      message: "Deliveries retrieved by date range",
      data: deliveries,
      count: deliveries.length,
    });
  } catch (error) {
    console.error("Get deliveries by date error:", error);
    return res.status(500).json({
      message: "Failed to retrieve deliveries by date range",
    });
  }
};
