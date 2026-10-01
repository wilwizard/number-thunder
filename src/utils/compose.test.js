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
