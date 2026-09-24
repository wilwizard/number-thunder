import { randomNumber, MAX_MAG, MAX_SIG_FIGS } from './randomNumber';

// A fake Math.random that returns the given values in order. randomNumber draws
// three: magnitude (1..MAX_MAG), significant figures (1..MAX_SIG_FIGS), then the
// multiple of the rounding step. Each value v picks item floor(v * count) of its range.
const randomSequence = (...values) => () => values.shift();

const significantFigures = n => String(n).replace(/0+$/, '').length;

const isValid = n =>
  Number.isInteger(n) &&
  n >= 1 &&
  n <= 10 ** MAX_MAG &&
  significantFigures(n) <= MAX_SIG_FIGS;

describe('randomNumber', () => {
  it('always returns a valid number (100,000 random draws)', () => {
    const invalid = [];
    for (let i = 0; i < 100000; i++) {
      const n = randomNumber();
      if (!isValid(n)) invalid.push(n);
    }
    expect(invalid.length).toBe(0);
  });

  it('rounds to the chosen number of significant figures', () => {
    // magnitude 5, 2 sig figs -> multiples of 1,000; 12th multiple -> 12,000
    expect(randomNumber(randomSequence(0.99, 0.5, 0.115))).toBe(12000);
  });

  it('does not round when the magnitude fits within the significant figures', () => {
    // magnitude 3, 3 sig figs -> any number 1..1000; 456th -> 456
    expect(randomNumber(randomSequence(0.5, 0.99, 0.455))).toBe(456);
  });

  it('never returns 0, even at the lowest pick', () => {
    // magnitude 5, 1 sig fig -> multiples of 10,000; lowest pick -> 10,000
    expect(randomNumber(randomSequence(0.99, 0.1, 0))).toBe(10000);
  });

  it('can reach the top of the range', () => {
    // magnitude 5, 1 sig fig -> multiples of 10,000; highest pick -> 100,000
    expect(randomNumber(randomSequence(0.99, 0.1, 0.9999))).toBe(100000);
  });

  it('handles Math.random() returning exactly 0', () => {
    // Math.random() can return 0 (but never 1).
    expect(isValid(randomNumber(randomSequence(0, 0, 0)))).toBe(true);
  });
});
