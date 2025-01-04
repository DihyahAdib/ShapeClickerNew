import mongoose from "mongoose";

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

export default mongoose.model("User", userSchema);
