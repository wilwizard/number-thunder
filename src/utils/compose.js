// The reverse of decompose: given some tokens, picks a number whose tokens
// include all of them. ['cuatro', 'cien'] can give 104, 140, 400, 994...
// Only looks at 1-999, since the thousands use the same patterns as the ones
// (so 'mil' never matches).

// Every number from 1 to 999 with its tokens. Made by scripts/generate-tokens.mjs.
import NUMBERS from './numberTokens.json';

// Returns null when no number has all the tokens, e.g. ['ce', 'enta'].
export function compose(tokens, random = Math.random) {
    const matches = NUMBERS.filter(entry =>
        tokens.every(token => entry.tokens.includes(token))
    );

    if (matches.length === 0) {
        return null;
    }

    return matches[Math.floor(random() * matches.length)].number;
}
