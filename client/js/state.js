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
      cost: 10,
      baseCost: 10, // Keep original cost as reference
      baseShapeProduction: 1,
    },
    {
      name: "Shape",
      owned: 0,
      cost: 50,
      baseCost: 50,
      baseShapeProduction: 5,
    },
    {
      name: "Mathematician",
      owned: 0,
      cost: 100,
      baseCost: 100,
      baseShapeProduction: 10,
    },
    {
      name: "Shipment",
      owned: 0,
      cost: 500,
      baseCost: 500,
      baseShapeProduction: 50,
    },
    {
      name: "Bank",
      owned: 0,
      cost: 1000,
      baseCost: 1000,
      baseShapeProduction: 100,
    },
    {
      name: "TopHat",
      owned: 0,
      cost: 15000,
      baseCost: 15000,
      baseShapeProduction: 150,
    },
    {
      name: "ThirdDimention",
      owned: 0,
      cost: 130000,
      baseCost: 130000,
      baseShapeProduction: 300,
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
      cost: 10,
      baseCost: 10,
      baseShapeProduction: 1,
    },
    {
      name: "Shape",
      owned: 0,
      cost: 50,
      baseCost: 50,
      baseShapeProduction: 5,
    },
    {
      name: "Mathematician",
      owned: 0,
      cost: 100,
      baseCost: 100,
      baseShapeProduction: 10,
    },
    {
      name: "Shipment",
      owned: 0,
      cost: 500,
      baseCost: 500,
      baseShapeProduction: 50,
    },
    {
      name: "Bank",
      owned: 0,
      cost: 1000,
      baseCost: 1000,
      baseShapeProduction: 100,
    },
    {
      name: "TopHat",
      owned: 0,
      cost: 15000,
      baseCost: 15000,
      baseShapeProduction: 150,
    },
    {
      name: "ThirdDimention",
      owned: 0,
      cost: 130000,
      baseCost: 130000,
      baseShapeProduction: 300,
    },
  ],

  getQuota(level = this.level) {
    return 15 * Math.pow(2, this.level);
  },

  calculateNextCost(baseCost, owned) {
    return Math.floor(baseCost * Math.pow(1.15, owned));
  },

  getLevel() {
    while (this.shapesClicked >= this.getQuota(this.level)) {
      this.increment("level", 1).increment("multiplier", 0.5);
    }
  },

  increment(key, value) {
    if (this[key] === undefined) {
      console.error(`Invalid key: ${key} does not exist`);
      return this;
    }
    const currentValue = parseFloat(this[key]) || 0;
    const valueToAdd = parseFloat(value) || 0;
    this.set(key, currentValue + valueToAdd);
    return this;
  },

  decrement(key, value) {
    if (this[key] === undefined) {
      console.error(`Invalid key: ${key} does not exist`);
      return this;
    }
    const currentValue = parseFloat(this[key]) || 0;
    const valueToSub = parseFloat(value) || 0;
    this.set(key, currentValue - valueToSub);
    return this;
  },

  incrementNestedObj(keyPath, value) {
    if (!keyPath || typeof keyPath !== "string") {
      console.error("Invalid keyPath:", keyPath);
      return this;
    }
    const keys = keyPath.split(".");
    let target = this;

    try {
      for (let i = 0; i < keys.length - 1; i++) {
        if (target[keys[i]] === undefined) {
          console.error(`Invalid path: ${keys[i]} does not exist in`, target);
          return this;
        }
        target = target[keys[i]];
      }
      const lastKey = keys[keys.length - 1];
      const currentValue = parseFloat(target[lastKey]) || 0;
      const valueToAdd = parseFloat(value) || 0;
      target[lastKey] = currentValue + valueToAdd;
      render();
      saveState();
      return this;
    } catch (error) {
      console.error("Error in incrementNestedObj:", error);
      return this;
    }
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
    saveStateThrottled();
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

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

const saveStateThrottled = debounce(() => saveState(), 5000);

Object.assign(data, startingState);

export const saveState = async () => {
  try {
    const saveData = {
      level: data.level,
      shapesClicked: data.shapesClicked,
      multiplier: data.multiplier,
      cash: data.cash,
      uncheckedAchievements: data.uncheckedAchievements,
      achievements: data.achievements,
      enableAnimationForBg: data.enableAnimationForBg,
      enableAnimationForShapes: data.enableAnimationForShapes,
      enableAnimationForBouncing: data.enableAnimationForBouncing,
      unlockedOverlays: data.unlockedOverlays,
      factorys: data.factorys.map(({ name, owned, baseCost }) => ({
        name,
        owned,
        baseCost,
      })),
    };
    const response = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...saveData }),
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

    const mergedFactories = startingState.factorys.map((defaultFactory, index) => {
      const savedFactory = savedState.factorys?.[index] || {};
      const owned = savedFactory.owned || 0;
      return {
        ...defaultFactory,
        owned, // Only override owned from saved state
        cost: data.calculateNextCost(defaultFactory.baseCost, owned),
      };
    });

    Object.assign(data, {
      ...startingState,
      ...savedState,
      factorys: mergedFactories,
    });

    render();
  } catch (error) {
    console.error("Error loading state:", error);
  }
};

export function debugFactoryValues() {
  data.factorys.forEach((factory, index) => {
    console.log(`Factory ${index} - ${factory.name}:`, {
      cost: factory.cost,
      owned: factory.owned,
      baseCost: factory.baseCost,
      baseShapeProduction: factory.baseShapeProduction,
    });
  });
}

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
  } catch (error) {
    console.error("Error resetting game:", error);
  }

  render();
  saveState();
}

export function initializeProduction() {
  let batchProduction = 0;

  setInterval(() => {
    data.factorys.forEach((factory) => {
      const production = factory.owned * factory.baseShapeProduction;
      batchProduction += production;
      factory.cost = data.calculateNextCost(factory.baseCost, factory.owned);
    });
    data.increment("shapesClicked", batchProduction);
    batchProduction = 0;
    render();
  }, 1000);
}

setInterval(() => {
  saveState();
}, 20000);

window.data = data;

render();

(async () => {
  await loadState();
  debugFactoryValues();
  initializeProduction();
})();
