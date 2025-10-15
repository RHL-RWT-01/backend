import express from "express";
import { logger } from "./middleware/logger";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { PORT, MONGO_URI } from "./config";
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";

const app = express();

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(logger);
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (_req, res) => res.json({ status: "ok" }));

async function start() {
  try {
    console.log("Connecting to MongoDB...", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB:", MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

start();

