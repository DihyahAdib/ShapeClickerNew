// state.js //

import { render } from "./Ui.js";

export const VAR = {
  level: 0,
  shapesClicked: 0,
  ach: [],
  multiplier: 0,
  quota: 15,
  cash: 0,
  enableAnimationForBg: true,
  enableAnimationForShapes: true,
  enableAnimationForBouncing: true,

  updateBonusShapeTimes(min, max) {
    this.bonusShapeMinTime = min;
    this.bonusShapeMaxTime = max;
    render();
    saveState();
  },

  increment(key, value) {
    this[key] += value;
    render();
    saveState();
  },

  decrement(key, value) {
    this[key] -= value;
    render();
    saveState();
  },

  multiply(key, value) {
    this[key] *= value;
    render();
    saveState();
  },

  set(key, value) {
    this[key] = value;
    render();
    saveState();
  },

  toggle(key) {
    this[key] = !this[key];
    render();
    saveState();
  },
};

window.VAR = VAR;

export const loadState = () => {
  const savedState = JSON.parse(localStorage.getItem("currentState") || "null");
  if (savedState) {
    VAR.level = savedState.level || 0;
    VAR.shapesClicked = savedState.shapesClicked || 0;
    VAR.ach = savedState.ach || [];
    VAR.multiplier = savedState.multiplier || 0;
    VAR.quota = savedState.quota || 15;
    VAR.cash = savedState.cash || 0;
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
      ach: VAR.ach,
      multiplier: VAR.multiplier,
      quota: VAR.quota,
      cash: VAR.cash,
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
  VAR.ach = [];
  VAR.multiplier = 0;
  VAR.quota = 15;
  VAR.cash = 0;
  VAR.enableAnimationForBg = true;
  VAR.enableAnimationForShapes = true;
  VAR.enableAnimationForBouncing = true;
  localStorage.removeItem("currentState");
  render();
}

render();
loadState();
