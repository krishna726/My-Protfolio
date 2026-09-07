const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const DEFAULT_PORT = 5000;
const PORT = process.env.PORT || DEFAULT_PORT;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database service is temporarily unavailable. Please try again shortly or contact via email."
      });
    }

    await Contact.create({ name, email, message });
    res.status(201).json({ message: "Message saved successfully." });
  } catch (error) {
    console.error("Contact save error:", error.message);
    res.status(500).json({ message: "Unable to save your message." });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Connect to MongoDB asynchronously without blocking or crashing the server
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("⚠️ MONGO_URI is missing in .env. Contact messages will not be saved to DB.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("⚠️ MongoDB connection warning (server will remain running):", error.message);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});
mongoose.connection.on("reconnected", () => {
  console.log("✅ MongoDB reconnected");
});

// Initialize database connection
connectDB();

// Global crash protection for uncaught exceptions and rejections
process.on("uncaughtException", (err) => {
  console.error("⚠️ Uncaught Exception caught:", err.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("⚠️ Unhandled Rejection caught:", reason);
});

// Start Express HTTP server with port conflict fallback
if (require.main === module) {
  const startServer = (portToTry) => {
    const server = app.listen(portToTry, () => {
      console.log(`🚀 Portfolio running at http://localhost:${portToTry}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`⚠️ Port ${portToTry} is already in use. Retrying on port ${portToTry + 1}...`);
        startServer(portToTry + 1);
      } else {
        console.error("Server listen error:", err.message);
      }
    });
  };

  startServer(Number(PORT));
}

module.exports = app;
