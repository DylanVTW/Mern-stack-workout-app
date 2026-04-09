import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import serviceRoutes from "./src/routes/serviceRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from  "./src/routes/adminRoutes.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/service", serviceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("Backend is running");
});

// Global error handler to return JSON instead of HTML on server errors
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err.message || "Internal server error" });
});

// Only connect to MongoDB and start server if not in test environment
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");

      app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error.message);
    });
}

export default app;
