import express from "express";
import {
  createEquipmentDelivery,
  getAllEquipmentDeliveries,
  getEquipmentDeliveryById,
  updateEquipmentDelivery,
  deleteEquipmentDelivery,
  getDeliveriesByUnit,
  getDeliveriesByDateRange,
} from "../controllers/delivery.controller.js";
import { authMiddleware } from "../middelware/auth.middleware.js";
import { roleMiddleware } from "../middelware/role.middleware.js";

const router = express.Router();

// All delivery routes require authentication
router.use(authMiddleware);

// Create equipment delivery (User, Manager, Admin)
router.post("/", createEquipmentDelivery);

// Get all equipment deliveries
router.get("/", getAllEquipmentDeliveries);

// Get deliveries by date range
router.get("/date-range", getDeliveriesByDateRange);

// Get deliveries by beneficiary unit
router.get("/unit/:unit", getDeliveriesByUnit);

// Get delivery by ID
router.get("/:id", getEquipmentDeliveryById);

// Update equipment delivery (Manager, Admin)
router.put("/:id", roleMiddleware("MANAGER", "ADMIN"), updateEquipmentDelivery);

// Delete equipment delivery (Admin only)
router.delete(
  "/:id",
  roleMiddleware("ADMIN", "MANAGER"),
  deleteEquipmentDelivery,
);

export default router;
