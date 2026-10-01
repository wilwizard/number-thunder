import { decompose } from './decompose';

// The examples from phonetic-similarity_v6.md, "How it works".
test.each([
    [30, ['tres', 'enta']],
    [100, ['cien']],
    [101, ['cien', 'to', 'uno']],
    [500, ['cinco', 'cien', 'tos']],
    [760, ['siete', 'cien', 'tos', 'seis', 'enta']],
    [17, ['diez', 'siete']],
    [14, ['cuatro', 'ce']],
    [1000, ['mil']],
    [45000, ['cuatro', 'enta', 'cinco', 'mil']],
])('design doc example: %i', (n, tokens) => {
    expect(decompose(n)).toEqual(tokens);
});

test('0 has no tokens', () => {
    expect(decompose(0)).toEqual([]);
});

test.each([
    [1, 'uno'], [2, 'dos'], [3, 'tres'], [4, 'cuatro'], [5, 'cinco'],
    [6, 'seis'], [7, 'siete'], [8, 'ocho'], [9, 'nueve'],
])('%i is the single token %s', (n, token) => {
    expect(decompose(n)).toEqual([token]);
});

test.each([
    [11, 'uno'], [12, 'dos'], [13, 'tres'], [14, 'cuatro'], [15, 'cinco'],
])('%i is %s + ce', (n, token) => {
    expect(decompose(n)).toEqual([token, 'ce']);
});

test('10 is diez', () => {
    expect(decompose(10)).toEqual(['diez']);
});

test.each([
    [16, 'seis'], [17, 'siete'], [18, 'ocho'], [19, 'nueve'],
])('%i is diez + %s', (n, token) => {
    expect(decompose(n)).toEqual(['diez', token]);
});

test('20 is veinte', () => {
    expect(decompose(20)).toEqual(['veinte']);
});

test.each([
    [21, 'uno'], [23, 'tres'], [26, 'seis'], [29, 'nueve'],
])('%i is veinte + %s', (n, token) => {
    expect(decompose(n)).toEqual(['veinte', token]);
});

test.each([
    [30, 'tres'], [40, 'cuatro'], [50, 'cinco'], [60, 'seis'],
    [70, 'siete'], [80, 'ocho'], [90, 'nueve'],
])('%i is %s + enta', (n, token) => {
    expect(decompose(n)).toEqual([token, 'enta']);
});

test('31 is tres + enta + uno, and 99 is nueve + enta + nueve', () => {
    expect(decompose(31)).toEqual(['tres', 'enta', 'uno']);
    expect(decompose(99)).toEqual(['nueve', 'enta', 'nueve']);
});

test('100 is cien, and 101-199 add to', () => {
    expect(decompose(100)).toEqual(['cien']);
    expect(decompose(110)).toEqual(['cien', 'to', 'diez']);
    expect(decompose(115)).toEqual(['cien', 'to', 'cinco', 'ce']);
    expect(decompose(120)).toEqual(['cien', 'to', 'veinte']);
    expect(decompose(199)).toEqual(['cien', 'to', 'nueve', 'enta', 'nueve']);
});

test.each([
    [200, 'dos'], [300, 'tres'], [400, 'cuatro'], [500, 'cinco'],
    [600, 'seis'], [700, 'siete'], [800, 'ocho'], [900, 'nueve'],
])('%i is %s + cien + tos', (n, token) => {
    expect(decompose(n)).toEqual([token, 'cien', 'tos']);
});

test('a zero digit adds no token', () => {
    expect(decompose(706)).toEqual(['siete', 'cien', 'tos', 'seis']);
    expect(decompose(1005)).toEqual(['mil', 'cinco']);
});

test('514 is cinco + cien + tos + cuatro + ce', () => {
    expect(decompose(514)).toEqual(['cinco', 'cien', 'tos', 'cuatro', 'ce']);
});

test('617 is seis + cien + tos + diez + siete', () => {
    expect(decompose(617)).toEqual(['seis', 'cien', 'tos', 'diez', 'siete']);
});

test('a repeated sound is listed each time: 777 has siete three times', () => {
    expect(decompose(777)).toEqual(['siete', 'cien', 'tos', 'siete', 'enta', 'siete']);
});

test('1,500 is mil + cinco + cien + tos', () => {
    expect(decompose(1500)).toEqual(['mil', 'cinco', 'cien', 'tos']);
});

test('21,000 (veintiún mil) is veinte + uno + mil', () => {
    expect(decompose(21000)).toEqual(['veinte', 'uno', 'mil']);
});

test('100,000 is cien + mil', () => {
    expect(decompose(100000)).toEqual(['cien', 'mil']);
});

test('the thousands come before mil and the rest after it', () => {
    expect(decompose(45678)).toEqual([
        'cuatro', 'enta', 'cinco', 'mil',
        'seis', 'cien', 'tos', 'siete', 'enta', 'ocho',
    ]);
});
