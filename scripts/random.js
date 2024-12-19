// randomize.js //

export function randomize(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
