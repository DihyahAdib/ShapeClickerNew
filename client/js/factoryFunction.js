//factoryFunction.js//
import { data } from "./state.js";
// 10 times 0.1 is how many shapes rewarded to the player per second.
//The baseShape and owned properties are the only ones increasing or changing.
//baseShapeProduction is how many shapes per sec: shape:(half shape per sec)
export function initializeProduction() {
  data.factorys.forEach((factory) => {
    if (factory.producing && typeof factory.producing === "number") {
      const intervalId = setInterval(() => {
        const production = factory.shapeCount * factory.baseShapeProduction;
        data.increment("shapesClicked", production);
      }, 1000);
      factory.producing = intervalId; // Store the new interval ID
    }
  });
}

$(".plus-shape").on("click", function () {
  const index = $(this).data("index");
  const currentFactory = data.factorys[index];
  $(this).text(`Cost: ${currentFactory.shapeCount}$ (Owned: ${currentFactory.owned})`);

  if (data.cash >= currentFactory.shapeCount) {
    data.decrement("cash", currentFactory.shapeCount);
    data.incrementNestedObj(`factorys.${index}.owned`, 1);
    data.incrementNestedObj(`factorys.${index}.shapeCount`, currentFactory.shapeCount);

    if (!currentFactory.producing || typeof currentFactory.producing !== "number") {
      const intervalId = setInterval(() => {
        const production = currentFactory.shapeCount * currentFactory.baseShapeProduction;
        data.increment("shapesClicked", production);
      }, 1000);
      currentFactory.producing = intervalId;
    }
  } else {
    $(this).textTimeout(
      `Not enough cash for ${currentFactory.name}!`,
      2000,
      `Cost: ${currentFactory.shapeCount}$ (Owned: ${currentFactory.owned})`
    );
  }
});

export function stopAllIntervals() {
  data.factorys.forEach((factory) => {
    if (factory.producing && typeof factory.producing === "number") {
      clearInterval(factory.producing);
      factory.producing = false;
    }
  });
}
