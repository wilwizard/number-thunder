export const MAX_MAG = 5;
export const MAX_SIG_FIGS = 3;

// A random whole number from min to max, inclusive. Uses floor rather than ceil,
// so it stays in range when random() returns 0 (it can; it never returns 1).
const randomInt = (min, max, random) => min + Math.floor(random() * (max - min + 1));

// A random number up to 10^MAX_MAG with at most MAX_SIG_FIGS significant figures.
// `random` defaults to Math.random; tests pass their own to get predictable numbers.
export function randomNumber(random = Math.random) {
  const magnitude = randomInt(1, MAX_MAG, random);
  const sigFigs = randomInt(1, MAX_SIG_FIGS, random);

  // Pick a multiple of the rounding step directly (e.g. 10,000 × 1..10 for
  // magnitude 5 with 1 sig fig), rather than rounding a pick down, which gave 0
  // whenever the pick was smaller than the step.
  const step = 10 ** Math.max(0, magnitude - sigFigs);
  return step * randomInt(1, 10 ** magnitude / step, random);
}
