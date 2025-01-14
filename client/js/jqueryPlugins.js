//jqueryPlugin.js
$.fn.spin = function (direction) {
  if (direction === "right") {
    $("svg#gear").addClass("spin").removeClass("Ospin");
  } else {
    $("svg#gear").removeClass("spin").addClass("Ospin");
  }
};

// Text Timeout
$.fn.textTimeout = async function (text, ms, newText) {
  this.text(text);
  await new Promise((resolve) => setTimeout(resolve, ms));
  this.text(newText);
  return this;
};

// Await
$.fn.wait = async function (ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

// Randomizer
export function randomize(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
