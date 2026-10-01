// Breaks a number into tokens, one per spoken sound. Every form of a sound
// counts as the same token: sete, set and siete are all 'siete'.
// 760 -> ['siete', 'cien', 'tos', 'seis', 'enta'] (sete·cien·tos ses·enta)
// Only goes up to 999,999, since the game's numbers stop at 100,000.
// See phonetic-similarity.md for the token table.

// Each digit's token. Every form of a digit (quin, cincu, cinco) uses the same one.
const DIGITS = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];

// The other tokens.
const DIEZ = 'diez';     // diez, dieci·séis
const VEINTE = 'veinte'; // veinte, veinti·trés
const CIEN = 'cien';     // cien, dos·cien·tos, quin·ien·tos
const TO = 'to';         // cien·to (101-199)
const TOS = 'tos';       // dos·cien·tos (200-999)
const ENTA = 'enta';     // cuar·enta, tre·inta
const CE = 'ce';         // on·ce, cator·ce
const MIL = 'mil';

export function decompose(n) {
    const thousands = Math.floor(n / 1000);
    const tokens = [];

    // 1,000 is just "mil", not "uno mil", so there's no "uno" token.
    if (thousands > 1) {
        tokens.push(...periodTokens(thousands));
    }
    if (thousands > 0) {
        tokens.push(MIL);
    }
    tokens.push(...periodTokens(n % 1000));

    return tokens;
}

// Tokens for a number from 0 to 999.
function periodTokens(n) {
    const hundreds = Math.floor(n / 100);
    const tens = Math.floor(n / 10) % 10;
    const ones = n % 10;
    const tokens = [];

    if (hundreds === 1) {
        // Exactly 100 is "cien"; 101-199 is "cien·to ...".
        tokens.push(CIEN);
        if (n % 100) {
            tokens.push(TO);
        }
    } else if (hundreds) {
        // dos·cien·tos, quin·ien·tos, sete·cien·tos...
        tokens.push(DIGITS[hundreds], CIEN, TOS);
    }

    // 11-15 are one word each: on·ce, cator·ce...
    if (tens === 1 && ones >= 1 && ones <= 5) {
        tokens.push(DIGITS[ones], CE);
        return tokens;
    }

    if (tens === 1) {
        tokens.push(DIEZ);
    } else if (tens === 2) {
        tokens.push(VEINTE);
    } else if (tens) {
        // tre·inta, cuar·enta, ses·enta...
        tokens.push(DIGITS[tens], ENTA);
    }

    if (ones) {
        tokens.push(DIGITS[ones]);
    }

    return tokens;
}
