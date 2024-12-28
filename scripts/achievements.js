// Achievements.js //

export const ACHIEVEMENTS = {
  aCuteAngle: {
    name: "A cute, Angle",
    description: "Click the triangle for the first time",
    ifUnlocked: false,
    condition: (data) => data.shapesClicked >= 1,
  },

  GeONeO: {
    name: "Geθ Neθ",
    description: "Reached A total of 50 clicks",
    ifUnlocked: false,
    condition: (data) => data.shapesClicked >= 50,
  },

  canNowUseFactory: {
    name: "Servant, Worker, Enem-",
    description: "Unlocked the Factory",
    ifUnlocked: false,
    condition: (data) => data.level >= 10,
  },

  ninetyDegreeAvenue: {
    name: "90 Degree Avenue",
    description: "Reach the square shape",
    ifUnlocked: false,
    condition: (data) => data.level >= 15,
  },

  squareButWorse: {
    name: "A Square but worst",
    description: "Reach the parallelogram shape",
    ifUnlocked: false,
    condition: (data) => data.level >= 50,
  },

  sixTimesBetter: {
    name: "x6",
    description: "Reach the hexagon shape",
    ifUnlocked: false,
    condition: (data) => data.level >= 150,
  },

  stop: {
    name: "stop... no literally",
    description: "Reach the octagon shape",
    ifUnlocked: false,
    condition: (data) => data.level >= 300,
  },

  barleyCircle: {
    name: "imposter syndrome",
    description: "Reach the nonagon shape",
    ifUnlocked: false,
    condition: (data) => data.level >= 500,
  },

  almostThere: {
    name: "Almost there",
    description: "Reach the decagon shape",
    ifUnlocked: false,
    condition: (data) => data.level >= 1000,
  },

  circle: {
    name: "wow... well that was anticlimactic",
    description: "Reach the circle shape",
    ifUnlocked: false,
    condition: (data) => data.level >= 2500,
  },

  keepClicking: {
    name: "keep it movin",
    description: "Just keep clicking buddy - Reached 10k clicks",
    ifUnlocked: false,
    condition: (data) => data.shapesClicked >= 10000,
  },

  hmm: {
    name: "hmm...",
    description: "HMMMM...",
    ifUnlocked: false,
    condition: (data) => data.level >= 100,
  },

  theManAtTheEndOfTime: {
    name: "man",
    description: "The man with the top hat",
    ifUnlocked: false,
    condition: (data) =>
      data.level >= 500 && data.shapesClicked >= 1000000000000,
  },
};

export function checkAchievements() {
  for (let key in ACHIEVEMENTS) {
    const ach = ACHIEVEMENTS[key]; // Useing ach as a reference to the achievement object
    if (!ach.unlocked && ach.condition(VAR)) {
      ach.ifUnlocked = true;
      if (!VAR.achievements.includes(ach.name)) {
        VAR.achievements.push(ach.name); // attempting to add to state array.
        showAchievementNotification(ach);
        updateAchievementList();
      }
    }
  }
}

export function updateAchievementList() {
  $("achievements-list").empty();
  for (let key in ACHIEVEMENTS) {
    const ach = ACHIEVEMENTS[key];

    const listItem = $("<div>")
      .addClass("ach-list-item")
      .text(`${ach.name} - ${ach.ifUnlocked ? "Unlocked" : "Locked"}`);

    if (ach.ifUnlocked) {
      listItem.addClass("unlocked");
    } else {
      listItem.addClass("locked");
    }
    listItem.appendTo("achievements-list");
  }
}

export function showAchievementNotification(ach) {
  //fallbacks
  const title = ach.name || "Achievement";
  const description = ach.description || "No description provided.";
  if ($(`achievement-popup[data-achievement="${ach.name}"]`).length > 0) {
    return;
  }
  $("<achievement-popup>")
    .attr("data-achievement", ach.name)
    .html(
      `<div class="ach-styling">
      <div>
        <button id="close-ach">&#10006;</button>
      </div>
      <div>
        <h3>Achievement Unlocked!</h3>
        <p>${title}</p>
        <p>${description}</p>
        <p>Unlocked</p>
      </div>
    </div>
  `
    )
    .appendTo("achievements-container");

  $("achievement-popup").addClass("active");
  setTimeout(() => {
    $("achievement-popup").addClass("active");
    setTimeout(() => $("achievement-popup").remove(), 300);
  }, 6000);
}
