// Await
export async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

// Randomizer
export function randomize(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
