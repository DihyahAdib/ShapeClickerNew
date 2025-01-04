import express from "express";
import {
  getUsers,
  saveUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/getUsers", getUsers);
router.post("/saveUser", saveUser);
router.put("/updateUser/:userId", updateUser);

export default router;
