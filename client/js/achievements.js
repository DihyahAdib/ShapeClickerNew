// Achievements.js //

export const ACHIEVEMENTS = {
  aCuteAngle: {
    name: "A cute, Angle",
    description: "Click the triangle for the first time",
    condition: (data) => data.shapesClicked >= 5,
  },

  GeONeO: {
    name: "Geθ Neθ",
    description: "Reached A total of 50 clicks",
    condition: (data) => data.shapesClicked >= 50,
  },

  canNowUseFactory: {
    name: "Servant, Worker, Enem-",
    description: "Unlocked the Factory",
    condition: (data) => data.level >= 10,
  },

  ninetyDegreeAvenue: {
    name: "90 Degree Avenue",
    description: "Reach the square shape",
    condition: (data) => data.level >= 15,
  },

  squareButWorse: {
    name: "A Square but worst",
    description: "Reach the parallelogram shape",
    condition: (data) => data.level >= 50,
  },

  sixTimesBetter: {
    name: "x6",
    description: "Reach the hexagon shape",
    condition: (data) => data.level >= 150,
  },

  stop: {
    name: "stop... no literally",
    description: "Reach the octagon shape",
    condition: (data) => data.level >= 300,
  },

  barleyCircle: {
    name: "imposter syndrome",
    description: "Reach the nonagon shape",
    condition: (data) => data.level >= 500,
  },

  almostThere: {
    name: "Almost there",
    description: "Reach the decagon shape",
    condition: (data) => data.level >= 1000,
  },

  circle: {
    name: "wow... well that was anticlimactic",
    description: "Reach the circle shape",
    condition: (data) => data.level >= 2500,
  },

  keepClicking: {
    name: "keep it movin",
    description: "Just keep clicking buddy - Reached 10k clicks",
    condition: (data) => data.shapesClicked >= 10000,
  },

  hmm: {
    name: "hmm...",
    description: "HMMMM...",
    condition: (data) => data.level >= 100,
  },

  theManAtTheEndOfTime: {
    name: "man",
    description: "The man with the top hat",
    condition: (data) => data.level >= 500 && data.shapesClicked >= 1000000000000,
  },
};

export function pushNewAchievement() {
  for (let key in ACHIEVEMENTS) {
    const ach = ACHIEVEMENTS[key]; // Using ach as a reference to the achievement object
    if (ach.condition(data)) {
      if (!data.achievements.includes(ach.name)) {
        data.push("achievements", ach.name).increment("uncheckedAchievements", 1); // attempting to add to state array.
        showAchievementNotification(ach);
      }
    }
  }
}

export function showAchievementNotification(ach) {
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
  }, 10000);
}
