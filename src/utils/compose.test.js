import { compose } from './compose';
import { decompose } from './decompose';

test('cuatro + cien gives a number with both tokens', () => {
    const tokens = decompose(compose(['cuatro', 'cien']));
    expect(tokens).toContain('cuatro');
    expect(tokens).toContain('cien');
});

test('matches are in order, so random() = 0 picks the smallest: 104', () => {
    expect(compose(['cuatro', 'cien'], () => 0)).toBe(104);
});

test('cuatro + ce + to only matches 114', () => {
    expect(compose(['cuatro', 'ce', 'to'])).toBe(114);
});

test('tokens that never appear together give null', () => {
    expect(compose(['ce', 'enta'])).toBeNull();
});

// A fake random() that returns the given values in order.
const sequence = (...values) => () => values.shift();

// For 'mil' the random values are used in order: the token half's pick
// (0 picks the smallest match), the other half (0 gives 1), then the coin
// flip (below 0.5 puts the token half before mil).

test('mil + cuatro can put cuatro before mil: 4,001', () => {
    expect(compose(['mil', 'cuatro'], sequence(0, 0, 0))).toBe(4001);
});

test('mil + cuatro can put cuatro after mil: 1,004', () => {
    expect(compose(['mil', 'cuatro'], sequence(0, 0, 0.9))).toBe(1004);
});

test('mil + cuatro gives a number with both tokens', () => {
    const tokens = decompose(compose(['mil', 'cuatro']));
    expect(tokens).toContain('mil');
    expect(tokens).toContain('cuatro');
});

test('mil + tokens that never appear together give null', () => {
    expect(compose(['mil', 'ce', 'enta'])).toBeNull();
});
