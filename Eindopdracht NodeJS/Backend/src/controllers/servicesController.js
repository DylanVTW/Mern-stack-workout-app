import Service from "../models/Service.js";
import mongoose from "mongoose";

const allowedServices = ["knip", "fade", "beard trim"];

const serviceData = {
  knip: {
    Price: 25,
    Description: "Standaard haarknip",
  },
  fade: {
    Price: 30,
    Description: "Fade haircut",
  },
  baard: {
    Price: 15,
    Description: "Baard Trimmen",
  },
};

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
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
  const { Name, Date, Time } = req.body;

  if (!allowedServices.includes(Name)) {
    return res
      .status(400)
      .json({ error: "Invalid choice. Choose: knip, fade or beard trim" });
  }

  const { Price, Description } = serviceData[Name];

  try {
    const service = await Service.create({
      Name,
      Date,
      Time,
      Price,
      Description,
      Status: 'Gepland',
      userId: req.user._id,
    });
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
    if (req.body.Name && !allowedServices.includes(req.body.Name)) {
      return res.status(400).json({
        error: "Invalid service. Choose: knip, fade or beard trim",
      });
    }
    const allowedStatus = ['Gepland', 'Geannuleerd'];

    if (req.body.Status && !allowedStatus.includes(req.body.Status)) {
        return res.status(400).json({
            error: 'Invalid status, Choose: Gepland or Geannuleerd '
        });
    }

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
