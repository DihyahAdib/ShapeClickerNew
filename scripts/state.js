// state.js //

import { render } from "./Ui.js";

export const ACHIEVEMENTS = {
  aCuteAngle: {
    name: "A cute, Angle",
    description: "Click the triangle for the first time",
    ifUnlocked: false,
    condition: (data) => data.shapesClicked >= 1,
  },
  GeONeO: {
    name: "Geθ Neθ",
    description: "Reached A total of 50 clicks",
    ifUnlocked: false,
    condition: (data) => data.shapesClicked >= 50,
  },
  ninetyDegreeAvenue: {
    name: "90 Degree Avenue",
    description: "Reach the square shape",
    ifUnlocked: false,
    condition: (data) => data.level >= 15,
  },
  keepClicking: {
    name: "keep it movin",
    description: "Just keep clicking buddy - Reached 10k clicks",
    ifUnlocked: false,
    condition: (data) => data.shapesClicked >= 10000,
  },
  hmm: {
    name: "hmm...",
    description: "HMMMM...",
    ifUnlocked: false,
    condition: (data) => data.level >= 100,
  },
};

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

function checkAchievements() {
  for (let key in ACHIEVEMENTS) {
    const ach = ACHIEVEMENTS[key]; // Useing ach as a reference to the achievement object
    if (!ach.unlocked && ach.condition(VAR)) {
      ach.ifUnlocked = true;
      if (!VAR.achievements.includes(ach.name)) {
        VAR.achievements.push(ach.name); // attempting to add to state array.
        showAchievementNotification(ach);
        updateAchievementList();
      }
    }
  }
}

function updateAchievementList() {
  VAR.achievements.forEach((achievementName) => {
    $("<li>").text(achievementName).appendTo("achievements-list");
  });
}

function showAchievementNotification(ach) {
  //fallbacks
  const title = ach.name || "Achievement";
  const description = ach.description || "No description provided.";
  if ($(`achievement-popup[data-achievement="${ach.name}"]`).length > 0) {
    return;
  }
  $("<achievement-popup>")
    .attr("data-achievement", ach.name)
    .html(
      `<div>
      <h3>Achievement Unlocked!</h3>
      <p>${title}</p>
      <p>${description}</p>
      <p>Unlocked</p>
    </div>
  `
    )
    .appendTo("achievements-container");
}

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
