// Spanish number words (from the n2words library) and audio clip paths.
// A number is split into three-digit periods ("veintiún mil" + "cinco"), and
// each period with its scale word is one audio clip, so any number is spoken
// by playing at most three clips.

import { toCardinal } from 'n2words/es-US';

// Folder names under public/audio, one per scale.
export const SCALES = ['millions', 'thousands', 'ones'];

const SCALE_SIZE = { millions: 1000000, thousands: 1000, ones: 1 };

// Words for one period, including its scale word: (21, 'thousands') -> "veintiún mil".
export function periodWords(value, scale) {
    return toCardinal(value * SCALE_SIZE[scale]);
}

export function toWords(n) {
    return toCardinal(n);
}

// Path of one period's clip, relative to the site root. Clips are grouped
// 100 to a folder by their hundreds digit: thousands 456 -> audio/thousands/4/456.mp3.
export function clipPath(scale, value) {
    return `audio/${scale}/${Math.floor(value / 100)}/${value}.mp3`;
}

// Clip URLs (relative to the site root) to play in order for n, one per
// non-zero period: 1021005 -> millions/0/1, thousands/0/21, ones/0/5.
export function clipPaths(n) {
    const millions = Math.floor(n / 1000000);
    const thousands = Math.floor(n / 1000) % 1000;
    const ones = n % 1000;

    const paths = [];
    if (millions) paths.push(clipPath('millions', millions));
    if (thousands) paths.push(clipPath('thousands', thousands));
    if (ones) paths.push(clipPath('ones', ones));
    return paths;
}
