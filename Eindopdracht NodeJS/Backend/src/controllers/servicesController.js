import Service from "../models/Service.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { sendBookingConfirmation } from "../utils/sendMail.js";

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
  const { Name, Date: dateString, Time } = req.body;

  const cleanName = Name.trim().toLowerCase();
  
  const serviceInfo = serviceData[cleanName];
  if(!serviceInfo) {
    return res.status(500).json({error: "Service data not found "});
  }
  const { Price, Description } = serviceData[cleanName];

  try {
    const selectedDate = new Date(dateString);
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const existingBooking = await Service.findOne({
      Date: {
        $gte: selectedDate,
        $lt: nextDate
      },
      Time,
      Status: "Gepland"
    });
    if (existingBooking) {
      return res.status(400).json({ error: "Deze datum en tijd zijn al gereserveerd"});
    }


    const service = await Service.create({
      Name: cleanName,
      Date: dateString,
      Time,
      Price,
      Description,
      Status: 'Gepland',
      userId: req.user._id,
    });

    // Stuur bevestigingsmail (niet-kritiek, dus geen error handling nodig)
    try {
      const user = await User.findById(req.user._id);
      if (user && user.email) {
        await sendBookingConfirmation(
          user.email,
          user.username,
          Name,
          dateString,
          Time,
          Price
        );
      }
    } catch (emailError) {
      // Log de error maar gooi door, de boeking staat al in de database
      console.error("Email sending error:", emailError.message);
    }

    res.status(201).json(service);
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateService = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ errors: { id: "Ongeldig service ID" } });
  }

  try {
    const service = await Service.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { ...req.body },
      { new: true },
    );
    if (!service) {
      return res.status(404).json({ errors: { id: "Service niet gevonden" } });
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

export const getAvailableTimeSlots = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Date parameter is verplicht"})
  }

  try {
    const allSlots = [
      "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
    ];

    const bookedServices = await Service.find({ Date: {
      $gte: new Date(date),
       $lt: new Date(new Date(date).getTime() + 24 *60 *60 * 1000)
      },
      Status: "Gepland"
    }).select("Time");


    const bookedSlots = bookedServices.map(services => services.Time);

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json({ availableTimeSlots: availableSlots, date });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
