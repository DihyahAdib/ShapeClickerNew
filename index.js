//index.js in root file//
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import mongoSanitize from "express-mongo-sanitize";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(mongoSanitize());

const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("Error: MONGO_URL is not defined.");
  process.exit(1);
}

if (!fs.existsSync(path.join(__dirname, "client"))) {
  console.error("Error: 'client' folder does not exist.");
  process.exit(1);
}
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  level: { type: Number, default: 0, min: 0 },
  shapesClicked: { type: Number, default: 0, min: 0 },
  multiplier: { type: Number, default: 0, min: 0 },
  cash: { type: Number, default: 0, min: 0 },
  uncheckedAchievements: { type: Number, default: 0, min: 0 },
  achievements: { type: [String], default: [] },
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
  factoryFunctionTimings: {
    I: { type: Number, default: 1000 },
    II: { type: Number, default: 10000 },
    III: { type: Number, default: 30000 },
    IV: { type: Number, default: 60000 },
    V: { type: Number, default: 120000 },
  },
  factoryFunctionCostAmount: {
    I: { type: Number, default: 10 },
    II: { type: Number, default: 50 },
    III: { type: Number, default: 100 },
    IV: { type: Number, default: 500 },
    V: { type: Number, default: 2000 },
    VI: { type: Number, default: 50000 },
  },
  factoryFunctionOutput: {
    I: { type: Number, default: 10 },
    II: { type: Number, default: 20 },
    III: { type: Number, default: 40 },
    IV: { type: Number, default: 80 },
    V: { type: Number, default: 100 },
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
    const allowedUpdates = [
      "level",
      "shapesClicked",
      "multiplier",
      "cash",
      "uncheckedAchievements",
      "achievements",
      "enableAnimationForBg",
      "enableAnimationForShapes",
      "enableAnimationForBouncing",
      "unlockedOverlays",
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const user = await UserModel.findOneAndUpdate(
      { userId: req.params.userId },
      updates,
      { new: true, upsert: true }
    );

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete specific user
app.get("/api/deleteUsers/:userId", async (req, res) => {
  try {
    await UserModel.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all users
app.get("/api/deleteUsers", async (req, res) => {
  try {
    await UserModel.deleteMany({});
    res.json({ message: "All users deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("database is connected successfully.");
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});
