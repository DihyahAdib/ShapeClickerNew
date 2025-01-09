import { ACHIEVEMENTS } from "./achievements.js";
import { formatPlaceValue, getShape } from "./shapeHandler.js";
import { data, resetGame, saveState } from "./state.js";
import { setupBounceablePlugin } from "./bounceable.js";
import "./factoryFunction.js";
setupBounceablePlugin();

export function initializeUi() {
  $("#bg").on("click", function () {
    data.toggle("enableAnimationForBg");
  });

  $("#spin").on("click", function () {
    data.toggle("enableAnimationForShapes");
  });

  $("#bounce").on("click", function () {
    data.toggle("enableAnimationForBouncing");
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

  $("achievements-container").on("click", "#close-ach", function () {
    $("achievement-popup").removeClass("active");
  });

  $("convert-clicks-to-cash:first").on("click", async function () {
    if (data.shapesClicked >= 10000) {
      data.decrement("shapesClicked", 10000);
      data.increment("cash", 10);
      $("progress-bar:first").addClass("visible");
      coolDown(30000, 0);
    } else {
      $("#text-warnings").textTimeout("Insufficient amount of shapes", 2000);
    }
  });

  $("lockedoverlay:first").on("click", async function () {
    if (data.shapesClicked < 10000) {
      $("#text-warnings").textTimeout("Locked: Reach 10k Shapes first", 2000);
    } else if (data.shapesClicked >= 10000) {
      data.unlockedOverlays.first = true;
      $(this).addClass("unlocked");
      saveState();
    }
  });

  $("convert-clicks-to-cash:eq(1)").on("click", async function () {
    if (data.shapesClicked >= 500000) {
      data.decrement("shapesClicked", 500000);
      data.increment("cash", 500);
      $("progress-bar:eq(1)").addClass("visible");
      coolDown(60000, 1);
    } else {
      $("#text-warnings").textTimeout("Insufficient amount of shapes", 2000);
    }
  });

  $("lockedoverlay:eq(1)").on("click", async function () {
    if (data.shapesClicked < 500000) {
      $("#text-warnings").textTimeout("Locked: Reach 500k Shapes first", 2000);
    } else if (data.shapesClicked >= 500000) {
      data.unlockedOverlays.second = true;
      $(this).addClass("unlocked");
      saveState();
    }
  });

  $("convert-clicks-to-cash:eq(2)").on("click", async function () {
    if (data.shapesClicked >= 1000000) {
      data.decrement("shapesClicked", 1000000);
      data.increment("cash", 1000);
      $("progress-bar:eq(2)").addClass("visible");
      coolDown(120000, 2);
    } else {
      $("#text-warnings").textTimeout("Insufficient amount of shapes", 2000);
    }
  });

  $("lockedoverlay:eq(2)").on("click", async function () {
    if (data.shapesClicked < 1000000) {
      $("#text-warnings").textTimeout("Locked: Reach 1M Shapes first", 2000);
    } else if (data.shapesClicked >= 1000000) {
      data.unlockedOverlays.third = true;
      $(this).addClass("unlocked");
      saveState();
    }
  });

  $("convert-max-clicks-to-cash").on("click", async function () {
    const MIN_SHAPES = 10000;
    if (data.shapesClicked >= MIN_SHAPES) {
      const shapesToConvert = Math.floor(data.shapesClicked / MIN_SHAPES) * MIN_SHAPES;
      const cashToAdd = shapesToConvert / 1000;
      data.decrement("shapesClicked", shapesToConvert);
      data.increment("cash", cashToAdd);
    } else {
      $("#text-warnings").textTimeout("Insufficient amount of shapes", 2000);
    }
  });

  $("lockedmax").on("click", async function () {
    if (data.shapesClicked < 100000000) {
      $("#text-warnings").textTimeout("Locked: Reach 100M Shapes first", 2000);
    } else if (data.shapesClicked >= 100000000) {
      data.unlockedOverlays.max = true;
      $(this).addClass("unlocked");
      saveState();
    }
  });

  $(".lockedoverlay:first").on("click", function () {
    if (data.level >= 10 && data.cash >= 10) {
      data.unlockedOverlays.firstUpg = true;
      $(this).addClass("unlocked");
      saveState();
    } else {
      $("#text-warnings-upg").textTimeout("Insufficient amount of level / cash", 2000);
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
    data.set("level", 0);
  });

  $("#Rshape").on("click", function () {
    data.set("shapesClicked", 0);
  });

  $("#Rach").on("click", function () {
    data.set("ach", []);
  });

  $("#Rmulti").on("click", function () {
    data.set("multiplier", 0);
  });

  $("#Rquota").on("click", function () {
    data.set("quota", 15);
  });

  $("#Rcash").on("click", function () {
    data.set("cash", 0);
  });

  $("[data-nav=achievements]").on("click", function () {
    data.set("uncheckedAchievements", 0);
  });

  for (let key in ACHIEVEMENTS) {
    const ach = ACHIEVEMENTS[key];
    const isUnlocked = data.achievements.includes(ach.name);
    const listItem = $("<div>")
      .addClass("ach-list-item")
      .text(`${ach.name} - ${isUnlocked ? "Unlocked" : "Locked"}`);
    listItem.appendTo("achievements-list");
  }
}

export function render() {
  setInterval(() => {}, 200);

  $("shapes").text(`${formatPlaceValue(data.shapesClicked)} Shapes`);
  $("plus-shapes").text(`+${formatPlaceValue(data.multiplier)} Shapes`);
  $("cash").text(`Cash ${formatPlaceValue(data.cash)}$`);
  $("level").text(`Level ${formatPlaceValue(data.level)}`);
  $("quota").text(`Quota ${formatPlaceValue(data.getQuota())}`);
  $("main").toggleClass("bgAnimation", data.enableAnimationForBg);

  $("svg-container").toggleClass("shape-spin", data.enableAnimationForShapes);
  $("svg-bouncing").html(getShape(data.level)).bounceable(data.enableAnimationForBouncing);

  $("bg").text(data.enableAnimationForBg ? "Unpaused" : "Paused");
  $("ss").text(data.enableAnimationForShapes ? "Unpaused" : "Paused");
  $("sb").text(data.enableAnimationForBouncing ? "Unpaused" : "Paused");

  $("number").text(data.uncheckedAchievements >= 9 ? "9+" : data.uncheckedAchievements);
  $("notification").toggleClass("active", data.uncheckedAchievements > 0);

  $(".ach-list-item").each(function (i) {
    const ach = ACHIEVEMENTS[Object.keys(ACHIEVEMENTS)[i]];
    const isUnlocked = data.achievements.includes(ach.name);

    $(this)
      .text(`${ach.name} - ${isUnlocked ? "Unlocked" : "Locked"}`)
      .toggleClass("unlocked", isUnlocked);
  });

  $("lockedoverlay:first").toggleClass("unlocked", data.unlockedOverlays.first);
  $("lockedoverlay:eq(1)").toggleClass("unlocked", data.unlockedOverlays.second);
  $("lockedoverlay:eq(2)").toggleClass("unlocked", data.unlockedOverlays.third);
  $("lockedmax").toggleClass("unlocked", data.unlockedOverlays.max);
  $(".lockedoverlay:first").toggleClass("unlocked", data.unlockedOverlays.firstUpg);

  $(".plus-shape").each(function () {
    const factoryIndex = $(this).data("index");
    const currentFactory = data.factorys[factoryIndex];
    if (currentFactory) {
      $(this).text(`Cost: ${formatPlaceValue(currentFactory.shapeCount)}$ (Owned: ${formatPlaceValue(currentFactory.owned)})`);
    } else {
      console.error("Invalid factory data for index:", factoryIndex);
    }
  });
}

$(document).ready(function () {
  $("[data-nav]").click(function (e) {
    e.preventDefault();
    const targetId = $(this).data("nav");
    const target = $(`#${targetId}`);
    $("[data-nav]").css("color", "white");
    $(this).css("color", "blue");
    target[0].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  });
});

async function coolDown(duration, index) {
  $("#text-warnings").text(`cooldown: ${duration / 1000} Seconds`);

  $(`progress-bar:eq(${index}) loading-part`).css({
    height: "100%",
  });
  $(`progress-bar:eq(${index}) loading-part`).animate(
    { height: "0%" },
    {
      duration: duration,
      easing: "linear",
      step: function (now) {
        const progress = Math.round(now);
        $(`progress-bar:eq(${index}) loading-part`).text(`${formatPlaceValue(progress)}%`);
      },
      complete: function () {
        $(`progress-bar:eq(${index})`).removeClass("visible");
        $("#text-warnings").text("");
        render();
      },
    }
  );
}
