//factoryFunction.js//
import { data } from "./state.js";

$.fn.factoryFunction = function ({ factoryItem: { cost, timing, givenAmount }, text, ms, newText }) {
  $(this).on("click", function () {
    if (data.cash >= cost) {
      data.decrement("cash", cost); //takes cash

      setInterval(() => {
        data.increment("shapesClicked", givenAmount); //give players shapes
      }, timing);

      data.incrementNestedObj(`${CostKey}`, cost);
    } else {
      $(this).textTimeout(text, ms, newText);
    }
  });
  return this;
};
