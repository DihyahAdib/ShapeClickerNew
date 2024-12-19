import { formatPlaceValue, getShape } from "./shapeHandler.js";
import { VAR, resetGame } from "./state.js";
import { wait } from "./utils.js";

export function initializeUi() {
  $("#bg").on("click", function () {
    VAR.toggle("enableAnimationForBg");
  });

  $("#spin").on("click", function () {
    VAR.toggle("enableAnimationForShapes");
  });

  $("#bounce").on("click", function () {
    VAR.toggle("enableAnimationForBouncing");
  });

  $("svg-spin").on("click", function () {
    $("svg#gear").spin("right");
  });

  $(".close").on("click", function () {
    $("svg#gear").spin("left");
  });

  $("#gear").on("click", function () {
    $("overlay").addClass("active");
    $("settings").addClass("active");
    $("#bar").addClass("active");
  });

  $(".close").on("click", function () {
    $("overlay").removeClass("active");
    $("settings").removeClass("active");
    $("#bar").removeClass("active");
  });

  $("#reset-game").on("click", function () {
    $("warning-screen").addClass("warn");
  });

  $("#RESETFORSURE").on("click", function () {
    resetGame();
    $("warning-screen").removeClass("warn");
    $("overlay").removeClass("active");
    $("settings").removeClass("active");
    $("#bar").removeClass("active");
  });

  $("convert-clicks-to-cash").on("click", async function () {
    if (VAR.shapesClicked >= 10000) {
      VAR.decrement("shapesClicked", 10000);
      VAR.increment("cash", 10);
    } else if (VAR.shapesClicked >= 500000) {
      VAR.decrement("shapesClicked", 500000);
      VAR.increment("cash", 500);
    } else if (VAR.shapesClicked >= 1000000) {
      VAR.decrement("shapesClicked", 1000000);
      VAR.increment("cash", 1000);
    }
    $("click-convert-warn")
      .text(VAR.shapesClicked >= 10000 ? "" : "Insufficient amount of shapes")
      .text(VAR.shapesClicked >= 500000 ? "" : "Insufficient amount of shapes")
      .text(
        VAR.shapesClicked >= 1000000 ? "" : "Insufficient amount of shapes"
      );
    await wait(2000);
  });

  $("convert-max-clicks-to-cash").on("click", async function () {
    const MIN_SHAPES = 10000;
    if (VAR.shapesClicked >= MIN_SHAPES) {
      const shapesToConvert =
        Math.floor(VAR.shapesClicked / MIN_SHAPES) * MIN_SHAPES;
      const cashToAdd = shapesToConvert / 1000;
      VAR.decrement("shapesClicked", shapesToConvert);
      VAR.increment("cash", cashToAdd);
    } else {
      $("click-convert-warn").text("Insufficient amount of shapes");
      await wait(2000);
      $("click-convert-warn").text("");
    }
  });

  $("more-info").on("mouseover", function () {
    $("prompt-frame-tip").addClass("active");
  });
  $("more-info").on("mouseout", function () {
    $("prompt-frame-tip").removeClass("active");
  });

  $("#DONT").on("click", function () {
    $("warning-screen").removeClass("warn");
  });

  $("#Rlevel").on("click", function () {
    VAR.set("level", 0);
  });

  $("#Rshape").on("click", function () {
    VAR.set("shapesClicked", 0);
  });

  $("#Rach").on("click", function () {
    VAR.set("ach", []);
  });

  $("#Rmulti").on("click", function () {
    VAR.set("multiplier", 0);
  });

  $("#Rquota").on("click", function () {
    VAR.set("quota", 15);
  });

  $("#Rcash").on("click", function () {
    VAR.set("cash", 0);
  });
}

export function render() {
  $("shapes").text(`${formatPlaceValue(VAR.shapesClicked)} Shapes`);
  $("plus-shapes").text(`+${formatPlaceValue(VAR.multiplier)} Shapes`);
  $("cash").text(`Cash ${formatPlaceValue(VAR.cash)}$`);
  $("level").text(`Level ${formatPlaceValue(VAR.level)}`);
  $("quota").text(`Quota ${formatPlaceValue(VAR.quota)}`);
  $("main").toggleClass("bgAnimation", VAR.enableAnimationForBg);
  $("svg-container").toggleClass("shape-spin", VAR.enableAnimationForShapes);
  $("svg-bouncing")
    .html(getShape(VAR.level))
    .bounceable(VAR.enableAnimationForBouncing);
  $("bg").text(VAR.enableAnimationForBg ? "Unpaused" : "Paused");
  $("ss").text(VAR.enableAnimationForShapes ? "Unpaused" : "Paused");
  $("sb").text(VAR.enableAnimationForBouncing ? "Unpaused" : "Paused");
}
