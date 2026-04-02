import express from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getAvailableTimeSlots,
} from "../controllers/servicesController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateCreateService, handleValidationErrors } from "../middleware/validators.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getAllServices);
router.get("/available-time-slots", getAvailableTimeSlots);
router.get("/:id", getServiceById);
router.post("/",  validateCreateService, handleValidationErrors, createService);
router.patch("/:id", updateService);
router.delete("/:id", deleteService);


export default router;
