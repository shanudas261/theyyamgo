const express = require("express");
const router = express.Router();

const EventSubmission = require("../models/EventSubmission");
const mongoose = require("mongoose");
const Kavu = require("../models/Kavu");
const requireAdmin = require("../middleware/authMiddleware");

const ALLOWED_DISTRICTS = [
  "Kannur",
  "Kasaragod",
  "Kozhikode",
  "Wayanad",
  "Malappuram",
];

function extractCoordinates(url) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    const isGoogleMaps =
      hostname === "google.com" ||
      hostname.endsWith(".google.com") ||
      hostname === "google.co.in" ||
      hostname.endsWith(".google.co.in");

    if (
      !isGoogleMaps ||
      !["http:", "https:"].includes(parsedUrl.protocol)
    ) {
      return null;
    }

    const patterns = [
      /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
      /[?&](?:q|query|ll)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
      /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);

      if (match) {
        const latitude = Number(match[1]);
        const longitude = Number(match[2]);

        if (
          Number.isFinite(latitude) &&
          Number.isFinite(longitude) &&
          latitude >= -90 &&
          latitude <= 90 &&
          longitude >= -180 &&
          longitude <= 180
        ) {
          return { latitude, longitude };
        }
      }
    }  

    return null;
  } catch {
    return null;
  }
}
// POST /api/event-submissions
// Public API: visitors can submit events for review.
router.post("/", async (req, res) => {
  try {
    const {
      kavuName,
      district,
      festivalName,
      date,
      theyyams,
      locationLink,
      submitterName,
      contact,
    } = req.body;

    // Validate required fields.
    if (
      typeof kavuName !== "string" ||
      !kavuName.trim() ||
      typeof festivalName !== "string" ||
      !festivalName.trim() ||
      typeof date !== "string" ||
      !date.trim() ||
      typeof district !== "string" ||
      !ALLOWED_DISTRICTS.includes(district) ||
      !Array.isArray(theyyams) ||
      theyyams.length === 0 ||
      !theyyams.every(
        (name) => typeof name === "string" && name.trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required event details.",
      });
    }

    // Validate the date.
    const parsedDate = new Date(date);

    if (
      Number.isNaN(parsedDate.getTime()) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      parsedDate.toISOString().slice(0, 10) !== date
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid festival date.",
      });
    }

    // Validate optional text fields.
    if (
      (locationLink !== undefined &&
        typeof locationLink !== "string") ||
      (submitterName !== undefined &&
        typeof submitterName !== "string") ||
      (contact !== undefined && typeof contact !== "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid optional field values.",
      });
    }

    // Accept only HTTP or HTTPS Google Maps links.
    const cleanLocationLink = (locationLink || "").trim();

    if (cleanLocationLink) {
      try {
        const parsedUrl = new URL(cleanLocationLink);

        if (
          !["http:", "https:"].includes(parsedUrl.protocol) ||
          !(
            parsedUrl.hostname === "google.com" ||
            parsedUrl.hostname.endsWith(".google.com") ||
            parsedUrl.hostname === "maps.google.com" ||
            parsedUrl.hostname === "maps.app.goo.gl" ||
            parsedUrl.hostname === "goo.gl"
          )
        ) {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid Google Maps link.",
          });
        }
      } catch {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid Google Maps link.",
        });
      }
    }
    const coordinates = extractCoordinates(cleanLocationLink);

if (!coordinates) {
  return res.status(400).json({
    success: false,
    message:
      "Unable to verify latitude and longitude from this URL. Please submit a Google Maps URL containing coordinates.",
  });
}

    const submission = await EventSubmission.create({
      kavuName: kavuName.trim(),
      district,
      festivalName: festivalName.trim(),
      date: parsedDate,
      theyyams: theyyams.map((name) => name.trim()),
      locationLink: cleanLocationLink,
      submitterName: (submitterName || "").trim(),
      contact: (contact || "").trim(),
      // Always pending. Never trust a status supplied by the visitor.
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Event submitted successfully for verification.",
      submissionId: submission._id,
    });
  } catch (error) {
    console.error("Event submission error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to submit the event. Please try again later.",
    });
  }
});

// GET /api/event-submissions
// Admin only: retrieve all submissions.
router.get("/", requireAdmin, async (req, res) => {
  try {
    const submissions = await EventSubmission.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Fetch submissions error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve event submissions.",
    });
  }
});

// PATCH /api/event-submissions/:id/approve
// Admin only: approve a submission and add it to an existing Kavu.
router.patch("/:id/approve", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID.",
      });
    }

    const submission = await EventSubmission.findById(id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    if (submission.status !== "Pending") {
      return res.status(409).json({
        success: false,
        message: "This submission has already been reviewed.",
      });
    }

    // Match the existing Kavu by name and district.
    const kavu = await Kavu.findOne({
      name: new RegExp(
        "^" +
          submission.kavuName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
          "$",
        "i"
      ),
      district: submission.district,
    });

    if (!kavu) {
      return res.status(404).json({
        success: false,
        message:
          "No matching Kavu exists. Add this Kavu with its map coordinates before approving the event.",
      });
    }

    // Avoid adding the same festival twice on the same date.
    const duplicateEvent = kavu.events.some((event) => {
      const existingDate = new Date(event.date);
      const submittedDate = new Date(submission.date);

      return (
        event.festivalName.trim().toLowerCase() ===
          submission.festivalName.trim().toLowerCase() &&
        existingDate.toISOString().slice(0, 10) ===
          submittedDate.toISOString().slice(0, 10)
      );
    });

    if (duplicateEvent) {
      return res.status(409).json({
        success: false,
        message:
          "This festival already exists at this Kavu on the selected date.",
      });
    }

    // Add the approved festival to the Kavu.
    kavu.events.push({
      festivalName: submission.festivalName,
      date: submission.date,
      theyyams: submission.theyyams,
    });

    await kavu.save();

    // Mark the submission as approved.
    submission.status = "Approved";
    await submission.save();

    return res.status(200).json({
      success: true,
      message: "Event approved and added to the Kavu successfully.",
    });
  } catch (error) {
    console.error("Approve submission error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to approve this submission.",
    });
  }
});

// PATCH /api/event-submissions/:id/reject
// Admin only: reject a pending submission.
router.patch("/:id/reject", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID.",
      });
    }

    const submission = await EventSubmission.findById(id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    if (submission.status !== "Pending") {
      return res.status(409).json({
        success: false,
        message: "This submission has already been reviewed.",
      });
    }

    submission.status = "Rejected";
    await submission.save();

    return res.status(200).json({
      success: true,
      message: "Event submission rejected.",
    });
  } catch (error) {
    console.error("Reject submission error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to reject this submission.",
    });
  }
});

module.exports = router;