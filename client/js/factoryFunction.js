//factoryFunction.js//
import { data, saveState } from "./state.js";
import { formatPlaceValue } from "./shapeHandler.js";

const BuyMode = [
  { key: "ONE", value: 1 },
  { key: "HUNDRED", value: 100 },
  { key: "HUNDRED", value: 500 },
];

let currentBuyMode = BuyMode[0].value;

export function calculateNextCost(baseCost, owned) {
  return Math.floor(baseCost * Math.pow(1.15, owned));
}

export function initializeFactoryHandlers() {
  $(".bulk").on("click", function () {
    const selectedKey = $(this).data("key");
    const selectedMode = BuyMode.find((mode) => mode.key === selectedKey);
    if (selectedMode) {
      currentBuyMode = selectedMode.value;
    }
  });

  $(".plus-shape").on("click", function () {
    const index = $(this).data("index");
    const currentFactory = data.factorys[index];
    const baseCost = currentFactory.baseCost;
    const cost = currentFactory.cost;
    const owned = currentFactory.owned;
    let totalCost = 0;
    for (let i = 0; i < currentBuyMode; i++) {
      totalCost += calculateNextCost(baseCost, owned + i);
    }

    if (data.cash >= totalCost) {
      data.decrement("cash", cost);
      data.incrementNestedObj(`factorys.${index}.owned`, currentBuyMode);
      const newOwned = owned + currentBuyMode;
      const newCost = calculateNextCost(baseCost, newOwned);
      data.factorys[index].cost = newCost;
      $(this)
        .find(".cost")
        .text(`Cost: ${formatPlaceValue(newCost)}$`);
      $(this)
        .find(".owned")
        .text(`Owned: ${formatPlaceValue(newOwned)}`);
      saveState();
    } else {
      $(this)
        .find(".cost")
        .textTimeout(
          `Not enough cash for ${currentBuyMode} ${currentFactory.name}!`,
          1500,
          `Cost: ${formatPlaceValue(cost)}$`
        );
    }
  });
}
