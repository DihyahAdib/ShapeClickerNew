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

$.fn.textTimeoutOnly = async function (text, ms) {
  this.text(text);
  await new Promise((resolve) => setTimeout(resolve, ms));
  return this;
};

$.fn.TimeoutExEl = async function ($el, text, ms, newText) {
  this.find($el).text(text);
  await new Promise((resolve) => setTimeout(resolve, ms));
  this.find($el).text(newText);
  return this;
};

$.fn.textFind = function ($el, text) {
  this.find($el).text(text);
};

// Await
export async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

// Randomizer
export function randomize(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
