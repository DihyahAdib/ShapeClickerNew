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

const factorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  owned: { type: Number, default: 0, min: 0 },
  shapeCount: { type: Number, required: true, min: 0 },
  baseShapeProduction: { type: Number, required: true, min: 0 },
  producing: { type: Boolean, default: null },
});

const defaultfactories = [
  {
    name: "Intern",
    owned: 0,
    shapeCount: 10,
    baseShapeProduction: 0.1,
    producing: null,
  },
  {
    name: "Shape",
    owned: 0,
    shapeCount: 50,
    baseShapeProduction: 0.5,
    producing: null,
  },
  {
    name: "Mathematician",
    owned: 0,
    shapeCount: 100,
    baseShapeProduction: 1,
    producing: null,
  },
  {
    name: "Shipment",
    owned: 0,
    shapeCount: 500,
    baseShapeProduction: 5,
    producing: null,
  },
  {
    name: "Bank",
    owned: 0,
    shapeCount: 1000,
    baseShapeProduction: 10,
    producing: null,
  },
  {
    name: "TopHat",
    owned: 0,
    shapeCount: 15000,
    baseShapeProduction: 15,
    producing: null,
  },
  {
    name: "ThirdDimention",
    owned: 0,
    shapeCount: 130000,
    baseShapeProduction: 30,
    producing: null,
  },
];

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
  factorys: { type: [factorySchema], default: defaultfactories },
});

const Factory = mongoose.model("Factory", factorySchema);
const UserModel = mongoose.model("users", userSchema);

export { Factory, UserModel };

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

// Update/save user state
app.put("/api/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const stateData = req.body;
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
      "factorys",
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (stateData[key] !== undefined) {
        updates[key] = stateData[key];
      }
    }

    const user = await UserModel.findOneAndUpdate({ userId }, { $set: updates }, { new: true, upsert: true });
    console.log(updates);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete specific user
app.get("/api/deleteUsers/:userId", async (req, res) => {
  try {
    const user = await UserModel.findOneAndDelete({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user: " + error.message });
  }
});

// Delete all users
app.get("/api/deleteUsers", async (req, res) => {
  try {
    const result = await UserModel.deleteMany({});
    res.json({ message: "All users deleted successfully", deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: "Error deleting users: " + error.message });
  }
});

//factory api req
// Get all factories
app.get("/api/factories", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId query parameter" });
    }

    const user = await UserModel.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.factorys); // Send the user's factories array
  } catch (error) {
    res.status(500).json({ message: "Error fetching factories: " + error.message });
  }
});

// Create a new factory
app.post("/api/factories", async (req, res) => {
  try {
    const { name, owned, shapeCount, baseShapeProduction, producing } = req.body;
    const newFactory = new Factory({
      name,
      owned,
      shapeCount,
      baseShapeProduction,
      producing,
    });
    const savedFactory = await newFactory.save();
    res.status(201).json(savedFactory);
  } catch (error) {
    res.status(400).json({ message: "Error creating factory: " + error.message });
  }
});

// Update a specific factory
app.put("/api/UPDfactories/:id", async (req, res) => {
  try {
    const factoryId = req.params.id;
    const updates = req.body;
    const updatedFactory = await Factory.findByIdAndUpdate(factoryId, updates, {
      new: true,
    });
    if (!updatedFactory) {
      return res.status(404).json({ message: "Factory not found" });
    }
    res.json(updatedFactory);
  } catch (error) {
    res.status(400).json({ message: "Error updating factory: " + error.message });
  }
});

// Delete a specific factory
app.delete("/api/DELfactories/:id", async (req, res) => {
  try {
    const factoryId = req.params.id;
    const deletedFactory = await Factory.findByIdAndDelete(factoryId);
    if (!deletedFactory) {
      return res.status(404).json({ message: "Factory not found" });
    }
    res.json({ message: "Factory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting factory: " + error.message });
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
