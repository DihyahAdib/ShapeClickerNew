//factoryFunction.js//
import { data } from "./state.js";
import { formatPlaceValue } from "./shapeHandler.js";
export function initializeFactoryHandlers() {
  $(".plus-shape")
    .off("click")
    .on("click", function () {
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
        currentFactory.cost = data.calculateNextCost(currentFactory.baseCost, currentFactory.owned);

        $(this).text(
          `Cost: ${formatPlaceValue(cost)}$ (Owned: ${formatPlaceValue(currentFactory.owned)})`
        );
      } else {
        $(this).text(`Not enough cash for ${currentFactory.name}!`);
        setTimeout(() => {
          $(this).text(
            `Cost: ${formatPlaceValue(cost)}$ (Owned: ${formatPlaceValue(currentFactory.owned)})`
          );
        }, 2000);
      }
    });
}
