import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./server/config/db.js";
import userRoutes from "./server/routes/users.js";

dotenv.config();
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

app.use("/api", userRoutes);

connectDB(MONGO_URL).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
