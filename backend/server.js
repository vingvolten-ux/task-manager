import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./db.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();

// deployed frontend + localhost
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://your-frontend-url.vercel.app"
  ]
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

//use Render's dynamic port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});