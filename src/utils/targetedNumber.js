// Picks numbers that contain tokens the player has been getting wrong.

import { compose } from './compose';

// Picks one token, more often the higher its count:
// { siete: 3, enta: 1 } gives 'siete' 3 times out of 4.
export function pickToken(tokenErrors, random = Math.random) {
    const total = Object.values(tokenErrors).reduce((sum, count) => sum + count, 0);
    let roll = random() * total;

    for (const [token, count] of Object.entries(tokenErrors)) {
        roll -= count;
        if (roll < 0) {
            return token;
        }
    }
}

// A number containing one missed token, or two (1 time in 3). Returns null
// when the two tokens can't appear in the same number, e.g. 'ce' and 'enta'.
export function targetedNumber(tokenErrors, random = Math.random) {
    const tokens = [pickToken(tokenErrors, random)];
    if (random() < 1 / 3) {
        tokens.push(pickToken(tokenErrors, random));
    }

    return compose(tokens, random);
}
