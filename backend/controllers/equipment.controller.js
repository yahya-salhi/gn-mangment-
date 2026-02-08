import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Equipment Reception (Create)
export const createEquipmentReception = async (req, res) => {
  try {
    const { equipmentName, category, quantity, minimumThreshold, sendingDept, receptionDate, notes } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!equipmentName || !category || !quantity || !minimumThreshold || !sendingDept || !receptionDate) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const equipment = await prisma.equipmentReception.create({
      data: {
        equipmentName,
        category,
        quantity: parseInt(quantity),
        minimumThreshold: parseInt(minimumThreshold),
        sendingDept,
        receptionDate: new Date(receptionDate),
        notes: notes || null,
        createdBy: userId,
      },
    });

    console.log(`✅ Equipment created:`, { id: equipment.id, name: equipment.equipmentName, quantity: equipment.quantity });

    return res.status(201).json({
      message: "Equipment reception recorded successfully",
      data: equipment,
    });
  } catch (error) {
    console.error("Create equipment error:", error);
    return res.status(500).json({ message: "Failed to create equipment reception" });
  }
};

// Get All Equipment Receptions (Read All)
export const getAllEquipmentReceptions = async (req, res) => {
  try {
    const equipments = await prisma.equipmentReception.findMany({
      orderBy: { createdAt: "desc" },
    });

    console.log(`✅ Retrieved ${equipments.length} equipment records`);

    return res.status(200).json({
      message: "Equipment receptions retrieved successfully",
      data: equipments,
      count: equipments.length,
    });
  } catch (error) {
    console.error("Get equipments error:", error);
    return res.status(500).json({ message: "Failed to retrieve equipment receptions" });
  }
};

// Get Equipment Reception By ID (Read One)
export const getEquipmentReceptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const equipment = await prisma.equipmentReception.findUnique({
      where: { id: parseInt(id) },
    });

    if (!equipment) {
      return res.status(404).json({ message: "Equipment reception not found" });
    }

    console.log(`✅ Retrieved equipment:`, { id: equipment.id, name: equipment.equipmentName });

    return res.status(200).json({
      message: "Equipment reception retrieved successfully",
      data: equipment,
    });
  } catch (error) {
    console.error("Get equipment error:", error);
    return res.status(500).json({ message: "Failed to retrieve equipment reception" });
  }
};

// Update Equipment Reception (Update)
export const updateEquipmentReception = async (req, res) => {
  try {
    const { id } = req.params;
    const { equipmentName, category, quantity, minimumThreshold, sendingDept, receptionDate, notes } = req.body;

    const equipment = await prisma.equipmentReception.findUnique({
      where: { id: parseInt(id) },
    });

    if (!equipment) {
      return res.status(404).json({ message: "Equipment reception not found" });
    }

    const updatedEquipment = await prisma.equipmentReception.update({
      where: { id: parseInt(id) },
      data: {
        equipmentName: equipmentName || equipment.equipmentName,
        category: category || equipment.category,
        quantity: quantity ? parseInt(quantity) : equipment.quantity,
        minimumThreshold: minimumThreshold ? parseInt(minimumThreshold) : equipment.minimumThreshold,
        sendingDept: sendingDept || equipment.sendingDept,
        receptionDate: receptionDate ? new Date(receptionDate) : equipment.receptionDate,
        notes: notes !== undefined ? notes : equipment.notes,
      },
    });

    console.log(`✅ Equipment updated:`, { id: updatedEquipment.id, name: updatedEquipment.equipmentName });

    return res.status(200).json({
      message: "Equipment reception updated successfully",
      data: updatedEquipment,
    });
  } catch (error) {
    console.error("Update equipment error:", error);
    return res.status(500).json({ message: "Failed to update equipment reception" });
  }
};

// Delete Equipment Reception (Delete)
export const deleteEquipmentReception = async (req, res) => {
  try {
    const { id } = req.params;

    const equipment = await prisma.equipmentReception.findUnique({
      where: { id: parseInt(id) },
    });

    if (!equipment) {
      return res.status(404).json({ message: "Equipment reception not found" });
    }

    await prisma.equipmentReception.delete({
      where: { id: parseInt(id) },
    });

    console.log(`✅ Equipment deleted:`, { id, name: equipment.equipmentName });

    return res.status(200).json({
      message: "Equipment reception deleted successfully",
      data: { id: equipment.id },
    });
  } catch (error) {
    console.error("Delete equipment error:", error);
    return res.status(500).json({ message: "Failed to delete equipment reception" });
  }
};

// Get Equipment By Category
export const getEquipmentByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const equipments = await prisma.equipmentReception.findMany({
      where: { category },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "Equipment receptions retrieved by category",
      data: equipments,
      count: equipments.length,
    });
  } catch (error) {
    console.error("Get equipment by category error:", error);
    return res.status(500).json({ message: "Failed to retrieve equipment by category" });
  }
};

// Get Low Stock Equipment (quantity below minimum threshold)
export const getLowStockEquipment = async (req, res) => {
  try {
    const equipments = await prisma.equipmentReception.findMany({
      where: {
        quantity: {
          lt: prisma.raw("minimumThreshold"), // Use Prisma raw for dynamic comparison
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "Low stock equipment retrieved",
      data: equipments,
      count: equipments.length,
    });
  } catch (error) {
    console.error("Get low stock error:", error);
    return res.status(500).json({ message: "Failed to retrieve low stock equipment" });
  }
};
