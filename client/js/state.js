// state.js //
import { render } from "./Ui.js";
import { pushNewAchievement } from "./achievements.js";

const userId = localStorage.getItem("userId") || crypto.randomUUID();
localStorage.setItem("userId", userId);

export const VAR = {
  level: 0,
  shapesClicked: 0,
  multiplier: 0,
  cash: 0,
  uncheckedAchievements: 0,
  achievements: [],
  enableAnimationForBg: true,
  enableAnimationForShapes: true,
  enableAnimationForBouncing: true,
  unlockedOverlays: {
    first: false,
    second: false,
    third: false,
    max: false,
    firstUpg: false,
  },

  updateBonusShapeTimes(min, max) {
    this.bonusShapeMinTime = min;
    this.bonusShapeMaxTime = max;
    pushNewAchievement();
    render();
    saveState();
  },

  increment(key, value) {
    this.set(key, this[key] + value);
    return this;
  },

  decrement(key, value) {
    this.set(key, this[key] - value);
    return this;
  },

  multiply(key, value) {
    this.set(key, this[key] * value);
    return this;
  },

  set(key, value) {
    this[key] = value;
    pushNewAchievement();
    render();
    saveState();
    return this;
  },

  toggle(key) {
    this.set(key, !this[key]);
    return this;
  },

  push(key, value) {
    this.set(key, [...this[key], value]);
    return this;
  },

  getQuota() {
    return 15 * Math.pow(2, this.level);
  },
};

export const loadState = async () => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      // If user doesn't exist, create new user
      if (response.status === 404) {
        await saveState(); // This will create a new user with default values
        return;
      }
      throw new Error("Failed to load state");
    }

    const savedState = await response.json();
    if (savedState) {
      VAR.level = savedState.level ?? 0;
      VAR.shapesClicked = savedState.shapesClicked ?? 0;
      VAR.multiplier = savedState.multiplier ?? 0;
      VAR.cash = savedState.cash ?? 0;
      VAR.unlockedOverlays = savedState.unlockedOverlays ?? {
        first: false,
        second: false,
        third: false,
        max: false,
        firstUpg: false,
      };
      VAR.uncheckedAchievements = savedState.uncheckedAchievements ?? 0;
      VAR.achievements = savedState.achievements ?? [];
      VAR.enableAnimationForBg = savedState.enableAnimationForBg ?? true;
      VAR.enableAnimationForShapes =
        savedState.enableAnimationForShapes ?? true;
      VAR.enableAnimationForBouncing =
        savedState.enableAnimationForBouncing ?? true;
      render();
    }
  } catch (error) {
    console.error("Error loading state:", error);
  }
};

export const saveState = async () => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        level: VAR.level,
        shapesClicked: VAR.shapesClicked,
        multiplier: VAR.multiplier,
        cash: VAR.cash,
        unlockedOverlays: VAR.unlockedOverlays,
        uncheckedAchievements: VAR.uncheckedAchievements,
        achievements: VAR.achievements,
        enableAnimationForBg: VAR.enableAnimationForBg,
        enableAnimationForShapes: VAR.enableAnimationForShapes,
        enableAnimationForBouncing: VAR.enableAnimationForBouncing,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save state");
    }
  } catch (error) {
    console.error("Error saving state:", error);
  }
};

export async function resetGame() {
  VAR.level = 0;
  VAR.shapesClicked = 0;
  VAR.multiplier = 0;
  VAR.cash = 0;
  VAR.unlockedOverlays = {
    first: false,
    second: false,
    third: false,
    max: false,
    firstUpg: false,
  };
  VAR.uncheckedAchievements = 0;
  VAR.achievements = [];
  VAR.enableAnimationForBg = true;
  VAR.enableAnimationForShapes = true;
  VAR.enableAnimationForBouncing = true;

  try {
    await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error resetting game:", error);
  }

  render();
  saveState();
}

window.VAR = VAR;
render();
// Changed to await since loadState is now async
(async () => {
  await loadState();
})();
