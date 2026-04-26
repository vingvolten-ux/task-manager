import cors from "cors";

app.use(cors({
  origin: "http://localhost:3000", // Allow requests from this origin
}));

import dotenv from "dotenv";
dotenv.config();

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/taskS");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});