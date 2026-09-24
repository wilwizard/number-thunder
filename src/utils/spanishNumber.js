// Spanish number words, split into three-digit periods ("ciento veintitrés mil"
// + "cuatrocientos cincuenta y seis"). Each period with its scale word is one
// audio clip, so any number is spoken by playing at most three clips.

export const MAX_NUMBER = 999999999;

// Folder names under public/audio, one per scale.
export const SCALES = ['millions', 'thousands', 'ones'];

const UNITS = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
const TEENS = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
const TWENTIES = ['veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
const TENS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const HUNDREDS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

// Words for 1–999.
function underThousand(n) {
    if (n === 100) return 'cien';

    const hundreds = Math.floor(n / 100);
    const rest = n % 100;
    const words = [];

    if (hundreds) words.push(HUNDREDS[hundreds]);
    if (rest >= 30) {
        words.push(TENS[Math.floor(rest / 10)]);
        if (rest % 10) words.push('y', UNITS[rest % 10]);
    } else if (rest >= 20) {
        words.push(TWENTIES[rest - 20]);
    } else if (rest >= 10) {
        words.push(TEENS[rest - 10]);
    } else if (rest) {
        words.push(UNITS[rest]);
    }

    return words.join(' ');
}

// Before "mil" / "millones", a trailing "uno" shortens: veintiún mil, ciento un millones.
function apocope(words) {
    return words
        .replace(/veintiuno$/, 'veintiún')
        .replace(/uno$/, 'un');
}

// Words for one period, including its scale word.
export function periodWords(value, scale) {
    switch (scale) {
        case 'millions':
            return value === 1 ? 'un millón' : `${apocope(underThousand(value))} millones`;
        case 'thousands':
            return value === 1 ? 'mil' : `${apocope(underThousand(value))} mil`;
        default:
            return underThousand(value);
    }
}

// Non-zero periods of n, largest first: 1021005 -> [millions 1, thousands 21, ones 5].
export function periods(n) {
    if (!Number.isInteger(n) || n < 1 || n > MAX_NUMBER) {
        throw new RangeError(`Number must be an integer from 1 to ${MAX_NUMBER}, got ${n}`);
    }
    const values = [Math.floor(n / 1e6), Math.floor(n / 1e3) % 1000, n % 1000];
    return SCALES
        .map((scale, i) => ({ scale, value: values[i] }))
        .filter(p => p.value > 0);
}

export function toWords(n) {
    return periods(n).map(p => periodWords(p.value, p.scale)).join(' ');
}

// Clip URLs (relative to the site root) to play in order for n.
export function clipPaths(n) {
    return periods(n).map(p => `audio/${p.scale}/${p.value}.mp3`);
}
