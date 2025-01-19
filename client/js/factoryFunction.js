//factoryFunction.js//
import { data, saveState } from "./state.js";
import { formatPlaceValue } from "./shapeHandler.js";

export function calculateNextCost(baseCost, owned) {
  return Math.floor(baseCost * Math.pow(1.15, owned));
}

export function initializeFactoryHandlers() {
  $(".plus-shape").on("click", function () {
    const index = $(this).data("index");
    const currentFactory = data.factorys[index];

    if (!currentFactory) {
      console.error("Invalid factory data for index:", index);
      return;
    }

    const cost = currentFactory.cost;
    if (data.cash >= cost) {
      data.decrement("cash", cost);
      data.incrementNestedObj(`factorys.${index}.owned`, 1);
      data.incrementNestedObj(`factorys.${index}.cost`, currentFactory.cost);

      const newCost = calculateNextCost(
        currentFactory.baseCost,
        currentFactory.owned
      );
      data.factorys[index].cost = newCost;
      $(this)
        .find(".cost")
        .text(`Cost: ${formatPlaceValue(newCost)}$`);
      $(this)
        .find(".owned")
        .text(`Owned: ${formatPlaceValue(currentFactory.owned)}`);
      saveState();
    } else {
      $(this)
        .find(".cost")
        .textTimeout(
          `Not enough cash for ${currentFactory.name}!`,
          1500,
          `Cost: ${formatPlaceValue(cost)}$`
        );
    }
  });
}
