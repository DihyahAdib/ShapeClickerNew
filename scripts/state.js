// state.js //

import { render } from "./Ui.js";
import { checkAchievements } from "./achievements.js";

export const VAR = {
  level: 0,
  shapesClicked: 0,
  multiplier: 0,
  quota: 15,
  cash: 0,
  enableAnimationForBg: true,
  enableAnimationForShapes: true,
  enableAnimationForBouncing: true,
  unlockedOverlays: {
    first: false,
    second: false,
    third: false,
    max: false,
  },

  achievements: [],
  totalAchievements: [
    "A cute, Angle",
    "Geθ Neθ",
    "90 Degree Avenue",
    "A Square but worst",
    "x6",
    "stop... no literally",
    "imposter syndrome",
    "Almost there",
    "wow... well that was anticlimactic",
    "keep it movin",
    "hmm...",
  ],

  updateBonusShapeTimes(min, max) {
    this.bonusShapeMinTime = min;
    this.bonusShapeMaxTime = max;
    checkAchievements();
    render();
    saveState();
  },

  increment(key, value) {
    this[key] += value;
    checkAchievements();
    render();
    saveState();
  },

  decrement(key, value) {
    this[key] -= value;
    checkAchievements();
    render();
    saveState();
  },

  multiply(key, value) {
    this[key] *= value;
    checkAchievements();
    render();
    saveState();
  },

  set(key, value) {
    this[key] = value;
    checkAchievements();
    render();
    saveState();
  },

  toggle(key) {
    this[key] = !this[key];
    checkAchievements();
    render();
    saveState();
  },
};

export const progress =
  (VAR.achievements.length / VAR.totalAchievements.length) * 100;

export const loadState = () => {
  const savedState = JSON.parse(localStorage.getItem("currentState") || "null");
  if (savedState) {
    VAR.level = savedState.level || 0;
    VAR.shapesClicked = savedState.shapesClicked || 0;
    VAR.multiplier = savedState.multiplier || 0;
    VAR.quota = savedState.quota || 15;
    VAR.cash = savedState.cash || 0;
    VAR.unlockedOverlays = savedState.unlockedOverlays || {
      first: false,
      second: false,
      third: false,
      max: false,
      firstUpg: false,
    };

    VAR.achievements = savedState.achievements || [];
    VAR.enableAnimationForBg = savedState.enableAnimationForBg ?? true;
    VAR.enableAnimationForShapes = savedState.enableAnimationForShapes ?? true;
    VAR.enableAnimationForBouncing =
      savedState.enableAnimationForBouncing ?? true;
    render();
  }
};

export const saveState = () => {
  localStorage.setItem(
    "currentState",
    JSON.stringify({
      level: VAR.level,
      shapesClicked: VAR.shapesClicked,
      multiplier: VAR.multiplier,
      quota: VAR.quota,
      cash: VAR.cash,
      unlockedOverlays: VAR.unlockedOverlays,
      achievements: VAR.achievements,
      enableAnimationForBg: VAR.enableAnimationForBg,
      enableAnimationForShapes: VAR.enableAnimationForShapes,
      enableAnimationForBouncing: VAR.enableAnimationForBouncing,
    })
  );
};

// Function to reset the game state
export function resetGame() {
  VAR.level = 0;
  VAR.shapesClicked = 0;
  VAR.multiplier = 0;
  VAR.quota = 15;
  VAR.cash = 0;
  VAR.unlockedOverlays = {
    first: false,
    second: false,
    third: false,
    max: false,
  };
  VAR.achievements = [];
  VAR.enableAnimationForBg = true;
  VAR.enableAnimationForShapes = true;
  VAR.enableAnimationForBouncing = true;
  localStorage.removeItem("currentState");
  render();
}

window.VAR = VAR;
render();
loadState();
