//factoryFunction.js//
import { data } from "./state.js";
// 10 times 0.1 is how many shapes rewarded to the player per second.
//The baseShape and owned properties are the only ones increasing or changing.
//baseShapeProduction is how many shapes per sec: shape:(half shape per sec)

$(".plus-shape").on("click", function () {
  const index = $(this).data("index");
  const currentFactory = data.factorys[index];
  $(this).text(`Cost: ${currentFactory.shapeCount}$ (Owned: ${currentFactory.owned})`);

  if (data.cash >= currentFactory.shapeCount) {
    data.decrement("cash", currentFactory.shapeCount);
    data.incrementNestedObj(`factorys.${index}.owned`, 1);
    data.incrementNestedObj(`factorys.${index}.shapeCount`, currentFactory.shapeCount);
    if (!currentFactory.producing) {
      currentFactory.producing = setInterval(() => {
        const production = currentFactory.shapeCount * currentFactory.baseShapeProduction;
        data.shapesClicked += production;
        // console.log(currentFactory.producing);
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
