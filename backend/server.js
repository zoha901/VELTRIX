require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error);
  });

app.get("/", (req, res) => {
  res.send("VELTRIX Backend is running!");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`VELTRIX server running on port ${PORT}`);
});