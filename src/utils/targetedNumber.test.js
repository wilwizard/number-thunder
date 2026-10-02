import { pickToken, targetedNumber } from './targetedNumber';

// A fake random() that returns the given values in order.
const sequence = (...values) => () => values.shift();

test('pickToken picks by count: siete covers the first 3/4, enta the last 1/4', () => {
    const tokenErrors = { siete: 3, enta: 1 };
    expect(pickToken(tokenErrors, () => 0)).toBe('siete');
    expect(pickToken(tokenErrors, () => 0.74)).toBe('siete');
    expect(pickToken(tokenErrors, () => 0.76)).toBe('enta');
});

// The random values below are used in order: pick a token, decide whether to
// pick a second one (below 1/3 means yes), [pick it,] then compose's choice
// (0 picks the smallest match).

test('one token: siete gives the smallest number with siete, 7', () => {
    expect(targetedNumber({ siete: 1 }, sequence(0, 0.9, 0))).toBe(7);
});

test('two tokens that never appear together give null', () => {
    expect(targetedNumber({ ce: 1, enta: 1 }, sequence(0, 0, 0.9))).toBeNull();
});
