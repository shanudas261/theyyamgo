const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/authMiddleware");
const Kavu = require("../models/Kavu");
const mongoose = require("mongoose");

// GET all Kavus
router.get("/", async (req, res) => {
  try {
    const kavus = await Kavu.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: kavus.length,
      data: kavus,
    });
  } catch (error) {
    console.error("Error fetching Kavus:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Kavus",
    });
  }
});

// GET one Kavu by ID
router.get("/:id", async (req, res) => {
  try {
    const kavu = await Kavu.findById(req.params.id);

    if (!kavu) {
      return res.status(404).json({
        success: false,
        message: "Kavu not found",
      });
    }

    res.status(200).json({
      success: true,
      data: kavu,
    });
  } catch (error) {
    console.error("Error fetching Kavu:", error.message);

    res.status(400).json({
      success: false,
      message: "Invalid Kavu ID",
    });
  }
});

// Create a new Kavu
router.post("/", requireAdmin,async (req, res) => {
  try {
    const { name, district, location, events } = req.body;

    // Validate required fields
    if (
      !name ||
      !district ||
      !location ||
      typeof location.latitude !== "number" ||
      typeof location.longitude !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide the Kavu name, district, and valid coordinates.",
      });
    }

    // Create the Kavu in MongoDB
    const newKavu = await Kavu.create({
      name,
      district,
      location,
      events: events || [],
    });

    res.status(201).json({
      success: true,
      message: "Kavu created successfully",
      data: newKavu,
    });
  } catch (error) {
    console.error("Error creating Kavu:", error.message);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to create Kavu",
    });
  }
});

// UPDATE a Kavu (admin only)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Kavu ID.",
      });
    }

    const { name, district, location, events } = req.body;

    if (
      !name?.trim() ||
      !district ||
      !location ||
      !Number.isFinite(Number(location.latitude)) ||
      !Number.isFinite(Number(location.longitude)) ||
      Number(location.latitude) < -90 ||
      Number(location.latitude) > 90 ||
      Number(location.longitude) < -180 ||
      Number(location.longitude) > 180 ||
      !Array.isArray(events)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid Kavu information.",
      });
    }

    const updatedKavu = await Kavu.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        district,
        location: {
          latitude: Number(location.latitude),
          longitude: Number(location.longitude),
        },
        events,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedKavu) {
      return res.status(404).json({
        success: false,
        message: "Kavu not found.",
      });
    }

    res.json({
      success: true,
      message: "Kavu updated successfully.",
      kavu: updatedKavu,
    });
  } catch (error) {
    console.error("Error updating Kavu:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to update Kavu.",
    });
  }
});

// DELETE a Kavu (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Kavu ID.",
      });
    }

    const deletedKavu = await Kavu.findByIdAndDelete(id);

    if (!deletedKavu) {
      return res.status(404).json({
        success: false,
        message: "Kavu not found.",
      });
    }

    res.json({
      success: true,
      message: "Kavu deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting Kavu:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete Kavu.",
    });
  }
});

module.exports = router;