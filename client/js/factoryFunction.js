//factoryFunction.js//
import { data } from "./state.js";

$(".plus-shape").on("click", function () {
  const index = $(this).data("index");
  const currentFactory = data.factorys[index];

  if (data.cash >= currentFactory.shapeCount) {
    data.decrement("cash", currentFactory.shapeCount);
    data.incrementNestedObj(`factorys.${factoryIndex}.owned`, 1);
    data.incrementNestedObj(`factorys.${factoryIndex}.shapeCount`, factory.shapeCount);

    if (!factory.producing) {
      factory.producing = true;
      setInterval(() => {
        const production = data.calculateProduction(factoryIndex);
        data.shapesClicked += production;
      }, 1000);
    }
  } else {
    $(this).textTimeout(
      `Not enough cash for ${currentFactory.name}!`,
      2000,
      `Cost: ${currentFactory.shapeCount}$ (Owned: ${currentFactory.owned})`
    );
  }
});
