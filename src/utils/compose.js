// The reverse of decompose: given some tokens, picks a number whose tokens
// include all of them. ['cuatro', 'cien'] can give 104, 140, 400, 994...
// ['mil', 'cuatro'] can give 4,512 or 512,004.

// Every number from 1 to 999 with its tokens. Made by scripts/generate-tokens.mjs.
import NUMBERS from './numberTokens.json';

// Returns null when no number has all the tokens, e.g. ['ce', 'enta'].
export function compose(tokens, random = Math.random) {
    // With 'mil', the number is [1-999] mil [1-999]. The other tokens go in
    // one half (picked by coin flip) and the other half is any number.
    if (tokens.includes('mil')) {
        const tokenHalf = compose(tokens.filter(token => token !== 'mil'), random);
        if (tokenHalf === null) {
            return null;
        }

        const otherHalf = 1 + Math.floor(random() * 999);
        if (random() < 0.5) {
            return tokenHalf * 1000 + otherHalf;
        }
        return otherHalf * 1000 + tokenHalf;
    }

    const matches = NUMBERS.filter(entry =>
        tokens.every(token => entry.tokens.includes(token))
    );

    if (matches.length === 0) {
        return null;
    }

    return matches[Math.floor(random() * matches.length)].number;
}
