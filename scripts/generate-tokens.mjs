// Writes src/utils/numberTokens.json: every number from 1 to 999 with its
// decompose() tokens, for compose.js to search. Runs before every build.

import { writeFile } from 'node:fs/promises';

import { decompose } from '../src/utils/decompose.js';

const numbers = [];
for (let number = 1; number <= 999; number++) {
    numbers.push({ number, tokens: decompose(number) });
}

await writeFile(new URL('../src/utils/numberTokens.json', import.meta.url), JSON.stringify(numbers));
