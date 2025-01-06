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
  factoryFunctionTimings: {
    I: 1000,
    II: 10000,
    III: 30000,
    IV: 60000,
    V: 120000,
  },
  factoryFunctionCostAmount: {
    I: 10,
    II: 50,
    III: 100,
    IV: 500,
    V: 2000,
    VI: 50000,
  },
  factoryFunctionOutput: {
    I: 10,
    II: 20,
    III: 40,
    IV: 80,
    V: 100,
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

  getQuota() {
    return 15 * Math.pow(2, this.level);
  },
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
    if (savedState) {
      data.level = savedState.level ?? 0;
      data.shapesClicked = savedState.shapesClicked ?? 0;
      data.multiplier = savedState.multiplier ?? 0;
      data.cash = savedState.cash ?? 0;
      data.unlockedOverlays = savedState.unlockedOverlays ?? {
        first: false,
        second: false,
        third: false,
        max: false,
        firstUpg: false,
      };
      data.factoryFunctionTimings = savedState.factoryFunctionTimings ?? {
        I: 1000,
        II: 10000,
        III: 30000,
        IV: 60000,
        V: 120000,
      };
      data.factoryFunctionCostAmount = savedState.factoryFunctionCostAmount ?? {
        I: 10,
        II: 50,
        III: 100,
        IV: 500,
        V: 2000,
        VI: 50000,
      };
      data.factoryFunctionOutput = savedState.factoryFunctionOutput ?? {
        I: 10,
        II: 20,
        III: 40,
        IV: 80,
        V: 100,
      };
      data.uncheckedAchievements = savedState.uncheckedAchievements ?? 0;
      data.achievements = savedState.achievements ?? [];
      data.enableAnimationForBg = savedState.enableAnimationForBg ?? true;
      data.enableAnimationForShapes =
        savedState.enableAnimationForShapes ?? true;
      data.enableAnimationForBouncing =
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
        level: data.level,
        shapesClicked: data.shapesClicked,
        multiplier: data.multiplier,
        cash: data.cash,
        unlockedOverlays: data.unlockedOverlays,
        factoryFunctionTimings: data.factoryFunctionTimings,
        factoryFunctionCostAmount: data.factoryFunctionCostAmount,
        factoryFunctionOutput: data.factoryFunctionOutput,
        uncheckedAchievements: data.uncheckedAchievements,
        achievements: data.achievements,
        enableAnimationForBg: data.enableAnimationForBg,
        enableAnimationForShapes: data.enableAnimationForShapes,
        enableAnimationForBouncing: data.enableAnimationForBouncing,
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
  data.level = 0;
  data.shapesClicked = 0;
  data.multiplier = 0;
  data.cash = 0;
  data.unlockedOverlays = {
    first: false,
    second: false,
    third: false,
    max: false,
    firstUpg: false,
  };
  data.factoryFunctionTimings = {
    I: 1000,
    II: 10000,
    III: 30000,
    IV: 60000,
    V: 120000,
  };
  data.factoryFunctionCostAmount = {
    I: 10,
    II: 50,
    III: 100,
    IV: 500,
    V: 2000,
    VI: 50000,
  };
  data.factoryFunctionOutput = {
    I: 10,
    II: 20,
    III: 40,
    IV: 80,
    V: 100,
  };
  data.uncheckedAchievements = 0;
  data.achievements = [];
  data.enableAnimationForBg = true;
  data.enableAnimationForShapes = true;
  data.enableAnimationForBouncing = true;

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

window.data = data;
render();
(async () => {
  await loadState();
})();
