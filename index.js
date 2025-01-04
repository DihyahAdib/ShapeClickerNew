//index.js in root file//
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  level: { type: Number, default: 0 },
  shapesClicked: { type: Number, default: 0 },
  multiplier: { type: Number, default: 0 },
  cash: { type: Number, default: 0 },
  uncheckedAchievements: { type: Number, default: 0 },
  achievements: [String],
  enableAnimationForBg: { type: Boolean, default: true },
  enableAnimationForShapes: { type: Boolean, default: true },
  enableAnimationForBouncing: { type: Boolean, default: true },
  unlockedOverlays: {
    first: { type: Boolean, default: false },
    second: { type: Boolean, default: false },
    third: { type: Boolean, default: false },
    max: { type: Boolean, default: false },
    firstUpg: { type: Boolean, default: false },
  },
});

const UserModel = mongoose.model("users", userSchema);

app.use(express.static("client"));

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const userData = await UserModel.find();
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific user
app.get("/api/users/:userId", async (req, res) => {
  try {
    const user = await UserModel.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user state
app.put("/api/users/:userId", async (req, res) => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user state
app.delete("/api/users/:userId", async (req, res) => {
  try {
    await UserModel.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("database is connected successfully.");
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
