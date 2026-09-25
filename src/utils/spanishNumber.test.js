import { clipPaths, periodWords, toWords } from './spanishNumber';

test('a number under 1000 is one clip, in folder 0 when under 100', () => {
    expect(clipPaths(7)).toEqual(['audio/ones/0/7.mp3']);
    expect(clipPaths(456)).toEqual(['audio/ones/4/456.mp3']);
});

test('a bigger number is one clip per non-zero period, largest first', () => {
    expect(clipPaths(45678)).toEqual(['audio/thousands/0/45.mp3', 'audio/ones/6/678.mp3']);
    expect(clipPaths(1021005)).toEqual([
        'audio/millions/0/1.mp3',
        'audio/thousands/0/21.mp3',
        'audio/ones/0/5.mp3',
    ]);
});

test('a zero period is skipped', () => {
    expect(clipPaths(300000)).toEqual(['audio/thousands/3/300.mp3']);
});

test('toWords spells out the whole number', () => {
    expect(toWords(45678)).toBe('cuarenta y cinco mil seiscientos setenta y ocho');
    expect(toWords(1021005)).toBe('un millón veintiún mil cinco');
});

test('periodWords includes the scale word', () => {
    expect(periodWords(21, 'thousands')).toBe('veintiún mil');
    expect(periodWords(1, 'millions')).toBe('un millón');
    expect(periodWords(7, 'ones')).toBe('siete');
});
