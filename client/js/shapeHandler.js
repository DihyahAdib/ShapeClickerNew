import { data } from "./state.js";
import { initializeUi } from "./Ui.js";
import { randomize } from "./utils.js";

export function handleClickingShapes() {
  data.increment("shapesClicked", 1 + data.multiplier);
  data.getLevel();
  if (data.level === 1 && data.getQuota() < 46) {
    $("prompt-frame").addClass("active");
  } else {
    $("prompt-frame").removeClass("active");
  }
}

// between 20 mins and 40 mins the bonus shape will appear //
let minTime = 1200000;
let maxTime = 1500000;

setTimeout(bonusShapes, randomize(minTime, maxTime));

export function bonusShapes() {
  $("bonus-shape").addClass("visible");
  setTimeout(() => {
    $("bonus-shape").removeClass("visible");
    setTimeout(bonusShapes, randomize(minTime, maxTime));
  }, 10000);
}

$("bonus-shape").on("click", function () {
  data.increment("shapesClicked", 40);
  $("bonus-shape").removeClass("visible");
  setTimeout(bonusShapes, randomize(minTime, maxTime));
});

export function getShape(level) {
  if (level < 15) {
    return `<svg width="250" height="250" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
      <polygon id="" points="125,0 250,250 0,250" fill="#ff6347" />
      </svg>`; // Triangle
  } else if (level >= 15 && level < 50) {
    return `<svg width="250" height="250" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
      <rect width="250" height="250" fill="#2196f3" />
      </svg>`; // Square
  } else if (level >= 50 && level < 150) {
    return `<svg width="250" height="250" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
      <rect transform="translate(0 0) skewX(10) skewY(0)"
    x="0" y="0" width="210" height="230" fill="#00bcd4"></rect></svg>`; // Parallelogram
  } else if (level >= 150 && level < 300) {
    return `<svg width="250" height="250" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
      <polygon
  points=" 125,0 31.25,62.5 31.25,187.5 125,250  218.75,187.5 218.75,62.5"
  fill="#e91e63"
/></svg>
`; // Hexagon
  } else if (level >= 300 && level < 500) {
    return `<svg width="250" height="250" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
      <polygon points=" 125,0  187.5,0  250,62.5  250,187.5  187.5,250 125,250  62.5,250  0,187.5  0,62.5  62.5,0" fill="#00bcd4"/></svg>`; // Octagon
  } else if (level >= 500 && level < 1000) {
    return `<svg width="250" height="250" viewBox="-177 -177 354 354" xmlns="http://www.w3.org/2000/svg">
      <polygon
  class="polygon"
  points="175,0 134.05777754582115,112.48783169514437 30.38843109171282,172.3413567771364 -87.49999999999996,151.55444566227678 -164.44620863753394,59.85352508199205 -164.44620863753397,-59.85352508199202 -87.50000000000007,-151.55444566227672 30.388431091712746,-172.3413567771364 134.05777754582112,-112.48783169514442 "
  fill="#37c8b0"
  stroke="#7a7a7a"
  stroke-width="0"
  transform="rotate(0, 0, 0)"
></polygon></svg>`; // Nonagon
  } else if (level >= 1000 && level < 2500) {
    return `<svg width="250" height="250" viewBox="-177 -177 354 354" xmlns="http://www.w3.org/2000/svg">
      <defs>
  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#d83bbe"></stop>
    <stop offset="100%" stop-color="#a43d3d"></stop>
  </linearGradient>
</defs>
<polygon
  points="167.5,0 135.5103465578037,98.45402975898925 51.7603465578037,159.30196647943822 -51.76034655780368,159.30196647943825 -135.51034655780367,98.45402975898926 -167.5,2.0512833885718166e-14 -135.51034655780373,-98.45402975898924 -51.760346557803715,-159.30196647943822 51.76034655780366,-159.30196647943825 135.51034655780367,-98.4540297589893 "
  fill="url(#gradient)"
  stroke="#7a7a7a"
  stroke-width="0"
  transform="rotate(0, 0, 0)"
/></svg>`; // Decagon
  } else if (level >= 2500) {
    return `<svg width="250" height="250" viewBox="250 250 300 300" xmlns="http://www.w3.org/2000/svg">
      <defs
  ><radialGradient id="sssurface-grad-dark" r="75%" cx="20%" cy="20%">
    <stop offset="0%" stop-color="hsl(351, 100%, 67%)" stop-opacity="0"></stop>
    <stop offset="100%" stop-color="#c61945" stop-opacity="1"></stop>
  </radialGradient><radialGradient
    id="sssurface-grad-light"
    r="25%"
    cx="30%"
    cy="30%"
  >
    <stop offset="0%" stop-color="#ff8b9e" stop-opacity="0.75"></stop>
    <stop offset="100%" stop-color="hsl(351, 100%, 67%)" stop-opacity="0"
    ></stop>
  </radialGradient><filter
    id="sssurface-blur"
    x="-100%"
    y="-100%"
    width="400%"
    height="400%"
    filterUnits="objectBoundingBox"
    primitiveUnits="userSpaceOnUse"
    color-interpolation-filters="sRGB"
  >
    <feGaussianBlur
      stdDeviation="30"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      in="SourceGraphic"
      edgeMode="none"
      result="blur"
    ></feGaussianBlur></filter
  ></defs
><g
  ><ellipse
    rx="153"
    ry="76.5"
    cx="450"
    cy="500"
    fill="#8f001f"
    opacity="0.25"
    filter="url(#sssurface-blur)"
  ></ellipse><circle r="153" cx="400" cy="400" fill="hsl(351, 100%, 67%)"
  ></circle><circle r="153" cx="400" cy="400" fill="url(#sssurface-grad-dark)"
  ></circle><circle r="153" cx="400" cy="400" fill="url(#sssurface-grad-light)"
  ></circle></g></svg>`; // Circle
  } else {
    return `<svg width="250" height="250" viewBox="250 250 300 300" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="50" fill="black">You broke the Game... Somehow.</text>
      </svg>`;
  }
}

export function formatPlaceValue(number) {
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  });

  if (number >= 1_000_000_000_000_000_000) {
    return formatter.format(number / 1_000_000_000_000_000_000) + "Qn"; // Quintillion
  } else if (number >= 1_000_000_000_000_000) {
    return formatter.format(number / 1_000_000_000_000_000) + "Qt"; // Quadrillion
  } else if (number >= 1_000_000_000_000) {
    return formatter.format(number / 1_000_000_000_000) + "T"; // Trillion
  } else if (number >= 1_000_000_000) {
    return formatter.format(number / 1_000_000_000) + "B"; // Billion
  } else if (number >= 1_000_000) {
    return formatter.format(number / 1_000_000) + "M"; // Million
  } else if (number >= 1_000) {
    return formatter.format(number / 1_000) + "K"; // Thousand
  }
  return formatter.format(number); // Less than 1,000
}

$("svg-container").on("click", function () {
  handleClickingShapes();
});

initializeUi();
