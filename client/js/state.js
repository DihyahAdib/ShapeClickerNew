// state.js //
import { render } from "./Ui.js";
import { pushNewAchievement } from "./achievements.js";

const urlParams = new URLSearchParams(window.location.search);
let userId = urlParams.get("userId");

if (!userId) {
  userId = crypto.randomUUID();
  const newUrl = `${window.location.pathname}?userId=${userId}`;
  window.history.pushState({ path: newUrl }, "", newUrl);
}
const startingState = {
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
  factorys: [
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
  ],
};

export const data = {
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
  factorys: [
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
  ],

  getQuota(level = this.level) {
    return 15 * Math.pow(2, this.level);
  },

  getLevel() {
    while (this.shapesClicked >= this.getQuota(this.level)) {
      this.increment("level", 1).increment("multiplier", 0.5);
    }
  },

  increment(key, value) {
    this.set(key, this[key] + value);
    return this;
  },

  decrement(key, value) {
    this.set(key, this[key] - value);
    return this;
  },

  incrementNestedObj(keyPath, value) {
    const keys = keyPath.split(".");
    let target = this;
    for (let i = 0; i < keys.length - 1; i++) {
      target = target[keys[i]];
    }
    const lastKey = keys[keys.length - 1];
    target[lastKey] += value;
    render();
    saveState();
    return this;
  },

  decrementNestedObj(keyPath, value) {
    const keys = keyPath.split(".");
    let target = this;
    for (let i = 0; i < keys.length - 1; i++) {
      target = target[keys[i]];
    }
    const lastKey = keys[keys.length - 1];
    target[lastKey] -= value;
    render();
    saveState();
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
};

Object.assign(data, startingState);

export const saveState = async () => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, ...data }),
    });
    if (!response.ok) {
      throw new Error("Failed to save state");
    }
  } catch (error) {
    console.error("Error saving state:", error);
  }
};

export const loadState = async () => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      if (response.status === 404) {
        await saveState();
        return;
      }
      throw new Error("Failed to load state");
    }

    const savedState = await response.json();
    Object.assign(data, { ...startingState, ...savedState });
    render();
  } catch (error) {
    console.error("Error loading state:", error);
  }
};

export async function resetGame() {
  Object.assign(data, startingState);

  try {
    const response = await fetch(`/api/deleteUsers/${userId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error resetting game: ${response.statusText}`);
    }
    console.log("User deleted successfully.");
    // location.reload();
  } catch (error) {
    console.error("Error resetting game:", error);
  }

  render();
  saveState();
}

window.data = data;
render();
(async () => {
  await loadState();
})();
