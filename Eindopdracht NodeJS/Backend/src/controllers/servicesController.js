import Service from "../models/Service.js";
import mongoose from "mongoose";

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find(
      { userId: req.user._id }.sort({
        createdAt: -1,
      }),
    );
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getServiceById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid service ID" });
  }

  try {
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const createService = async (req, res) => {
  const { serviceName, Date, Time } = req.body;
  try {
    const service = await Service.create({ serviceName, Date, Time });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateService = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid service ID" });
  }

  try {
    const service = await Service.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { ...req.body },
      { new: true },
    );
    if (!service) {
      return res.status(404).json({ error: "Invalid service ID" });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteService = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid service ID" });
  }

  try {
    const service = await Service.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted " });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
