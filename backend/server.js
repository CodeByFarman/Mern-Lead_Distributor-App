import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import Admin from "./models/Admin.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/upload", uploadRoutes);

// Function to seed default admin
const createSeedAdmin = async () => {
  const existing = await Admin.findOne({ email: "admin@example.com" });
  if (existing) return;

  const admin = new Admin({
    email: "admin@example.com",
    password: "admin123",
  });

  await admin.save();
  console.log("Seed admin created");
  console.log(`Username: ${email}, Password: ${password}`);
};

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);

  // Seed admin after DB connection
  await createSeedAdmin();
});
