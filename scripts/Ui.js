import { formatPlaceValue, getShape } from "./shapeHandler.js";
import { VAR, resetGame, saveState } from "./state.js";
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

  $("convert-clicks-to-cash:first").on("click", async function () {
    if (VAR.shapesClicked >= 10000) {
      VAR.decrement("shapesClicked", 10000);
      VAR.increment("cash", 10);
    } else {
      $("#text-for-standard-warnings").text("Insufficient amount of shapes");
      await wait(2000);
      $("#text-for-standard-warnings").text("");
    }
  });

  $("convert-clicks-to-cash:eq(1)").on("click", async function () {
    if (VAR.shapesClicked >= 500000) {
      VAR.decrement("shapesClicked", 500000);
      VAR.increment("cash", 500);
    } else {
      $("#text-for-standard-warnings").text("Insufficient amount of shapes");
      await wait(2000);
      $("#text-for-standard-warnings").text("");
    }
  });

  $("convert-clicks-to-cash:eq(2)").on("click", async function () {
    if (VAR.shapesClicked >= 1000000) {
      VAR.decrement("shapesClicked", 1000000);
      VAR.increment("cash", 1000);
    } else {
      $("#text-for-standard-warnings").text("Insufficient amount of shapes");
      await wait(2000);
      $("#text-for-standard-warnings").text("");
    }
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
      $("#text-for-standard-warnings").text("Insufficient amount of shapes");
      await wait(2000);
      $("#text-for-standard-warnings").text("");
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

$("lockedoverlay:first").on("click", async function () {
  if (VAR.shapesClicked < 10000) {
    $("#text-for-standard-warnings").text("Locked: Reach 10k Shapes first");
    await wait(2500);
    $("#text-for-standard-warnings").text("");
  } else if (VAR.shapesClicked >= 10000) {
    VAR.unlockedOverlays.first = true;
    $(this).addClass("unlocked");
    saveState();
  }
});

$("lockedoverlay:eq(1)").on("click", async function () {
  if (VAR.shapesClicked < 500000) {
    $("#text-for-standard-warnings").text("Locked: Reach 500k Shapes first");
    await wait(2500);
    $("#text-for-standard-warnings").text("");
  } else if (VAR.shapesClicked >= 500000) {
    $("lockedoverlay:eq(1)").addClass("unlocked");
    VAR.unlockedOverlays.second = true;
    $(this).addClass("unlocked");
    saveState();
  }
});

$("lockedoverlay:eq(2)").on("click", async function () {
  if (VAR.shapesClicked < 1000000) {
    $("#text-for-standard-warnings").text("Locked: Reach 1M Shapes first");
    await wait(2800);
    $("#text-for-standard-warnings").text("");
  } else if (VAR.shapesClicked >= 1000000) {
    VAR.unlockedOverlays.third = true;
    $(this).addClass("unlocked");
    saveState();
  }
});

$("lockedmax").on("click", async function () {
  if (VAR.shapesClicked < 100000000) {
    $("#text-for-standard-warnings").text("Locked: Reach 100M Shapes first");
    await wait(2800);
    $("#text-for-standard-warnings").text("");
  } else if (VAR.shapesClicked >= 100000000) {
    VAR.unlockedOverlays.max = true;
    $(this).addClass("unlocked");
    saveState();
  }
});

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
  if (VAR.unlockedOverlays.first) {
    $("lockedoverlay:first").addClass("unlocked");
  }
  if (VAR.unlockedOverlays.second) {
    $("lockedoverlay:eq(1)").addClass("unlocked");
  }
  if (VAR.unlockedOverlays.third) {
    $("lockedoverlay:eq(2)").addClass("unlocked");
  }
  if (VAR.unlockedOverlays.max) {
    $("lockedmax").addClass("unlocked");
  }
}
