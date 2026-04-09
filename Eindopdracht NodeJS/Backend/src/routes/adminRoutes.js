import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import Service from "../models/Service.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);

    const formattedServices = services.map((service) => ({
      _id: service._id,
      Name: service.Name,
      Date: service.Date,
      Time: service.Time,
      Description: service.Description,
      Status: service.Status,
      customerName: service.userId.username,
      customerEmail: service.userId.email,
      userId: service.userId._id,
    }));
    res.status(200).json(formattedServices);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
