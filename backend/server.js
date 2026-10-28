require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const kavuRoutes = require("./routes/kavuRoutes");
const authRoutes = require("./routes/authRoutes");
const eventSubmissionRoutes = require("./routes/eventSubmissionRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health-check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TheyyamGo API is running",
  });
});

// Kavu routes
app.use("/api/kavus", kavuRoutes);
app.use("/api/auth", authRoutes);

// Public event submission routes
app.use("/api/event-submissions", eventSubmissionRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`TheyyamGo API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();