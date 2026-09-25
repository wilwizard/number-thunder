// Generates one mp3 per (period, scale) into public/audio using Google Cloud
// Text-to-Speech, e.g. public/audio/thousands/0/21.mp3 -> "veintiún mil".
// Google's audio is fetched uncompressed, then ffmpeg trims the silence Google pads
// each clip with (so clips can be played back to back) and encodes it to mp3.
// Requires ffmpeg on the PATH.
//
// Only missing files are generated, so it's a no-op once everything exists and
// resumes cleanly after an interrupted run.
//
//   npm run generate-audio               generate missing clips
//   npm run generate-audio -- --dry-run  list what would be generated, no API calls
//   npm run generate-audio -- --force    regenerate everything (e.g. after changing voice)
//
// Config:
//   GOOGLE_TTS_API_KEY  required when clips are missing; read from creds.json
//                       (gitignored) or the environment
//   TTS_VOICE           Google voice name, default es-US-Neural2-A
//   TTS_SPEAKING_RATE   default 1.0

import { spawn, spawnSync } from 'node:child_process';
import { mkdir, readFile, rename, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SCALES, clipPath, periodWords } from '../src/utils/spanishNumber.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const AUDIO_DIR = join(ROOT, 'public', 'audio');
const CREDS_FILE = join(ROOT, 'creds.json');
const CONCURRENCY = 8;
const MAX_RETRIES = 5;
// Google's default quota is 1000 requests/minute per project; stay under it.
const REQUESTS_PER_MINUTE = 900;

// Audio quieter than this at a clip's edges counts as silence and is trimmed.
const SILENCE_THRESHOLD = '-40dB';
// Silence kept at each edge, so soft word edges aren't cut off.
const EDGE_PADDING = '0.02';
const MP3_BITRATE = '64k';

async function readCreds() {
    try {
        return JSON.parse(await readFile(CREDS_FILE, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') return {};
        throw new Error(`Could not parse creds.json: ${err.message}`);
    }
}

const API_KEY = (await readCreds()).GOOGLE_TTS_API_KEY || process.env.GOOGLE_TTS_API_KEY;
const VOICE = process.env.TTS_VOICE || 'es-US-Neural2-A';
const SPEAKING_RATE = Number(process.env.TTS_SPEAKING_RATE || 1);

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const force = args.has('--force');

async function exists(path) {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}

function allClips() {
    const clips = [];
    for (const scale of SCALES) {
        for (let value = 1; value <= 999; value++) {
            clips.push({
                file: join(ROOT, 'public', clipPath(scale, value)),
                text: periodWords(value, scale),
            });
        }
    }
    return clips;
}

// Spaces request starts evenly so the run never exceeds REQUESTS_PER_MINUTE.
let nextRequestAt = 0;
async function throttle() {
    const now = Date.now();
    const wait = Math.max(0, nextRequestAt - now);
    nextRequestAt = Math.max(now, nextRequestAt) + 60000 / REQUESTS_PER_MINUTE;
    if (wait) await new Promise(r => setTimeout(r, wait));
}

async function synthesize(text) {
    await throttle();
    const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            input: { text },
            voice: { name: VOICE, languageCode: VOICE.split('-').slice(0, 2).join('-') },
            // LINEAR16 comes back as a WAV file, so the only lossy encode is ours.
            audioConfig: { audioEncoding: 'LINEAR16', speakingRate: SPEAKING_RATE },
        }),
    });
    if (!res.ok) {
        const err = new Error(`TTS request failed (${res.status}) for "${text}": ${await res.text()}`);
        err.retryable = res.status === 429 || res.status >= 500;
        throw err;
    }
    const { audioContent } = await res.json();
    return Buffer.from(audioContent, 'base64');
}

// silenceremove only trims the start, so trailing silence is trimmed by
// reversing the audio, trimming its (now leading) silence, and reversing back.
const TRIM = `silenceremove=start_periods=1:start_threshold=${SILENCE_THRESHOLD}:start_silence=${EDGE_PADDING}:detection=peak`;

// Output goes to a file, not a pipe: ffmpeg writes the mp3's LAME header last by
// seeking back to the start, and that header is what tells browsers to skip the
// ~46ms of silence the mp3 encoder adds to the front of every file.
function trimAndEncode(wav, outFile) {
    return new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
            '-hide_banner', '-loglevel', 'error', '-y',
            '-f', 'wav', '-i', 'pipe:0',
            '-af', `${TRIM},areverse,${TRIM},areverse`,
            '-c:a', 'libmp3lame', '-b:a', MP3_BITRATE,
            '-f', 'mp3', outFile,
        ]);
        let stderr = '';
        ffmpeg.stderr.on('data', chunk => { stderr += chunk; });
        ffmpeg.stdin.on('error', () => {}); // reported via the exit code below
        ffmpeg.on('error', reject);
        ffmpeg.on('close', code => {
            if (code === 0) resolve();
            else reject(new Error(`ffmpeg exited with code ${code}: ${stderr}`));
        });
        ffmpeg.stdin.end(wav);
    });
}

async function generate({ file, text }) {
    for (let attempt = 1; ; attempt++) {
        try {
            const wav = await synthesize(text);
            await mkdir(dirname(file), { recursive: true });
            // Encode to a temp file then rename, so an interrupted run never leaves a truncated mp3 behind.
            await trimAndEncode(wav, `${file}.tmp`);
            await rename(`${file}.tmp`, file);
            return;
        } catch (err) {
            if (!err.retryable || attempt >= MAX_RETRIES) throw err;
            // 4s, 8s, 16s, 32s: long enough to outlast a one-minute quota window.
            await new Promise(r => setTimeout(r, 2000 * 2 ** attempt));
        }
    }
}

async function main() {
    const clips = allClips();
    const todo = [];
    for (const clip of clips) {
        if (force || !(await exists(clip.file))) todo.push(clip);
    }

    if (todo.length === 0) {
        console.log(`Audio up to date (${clips.length} clips in public/audio).`);
        return;
    }

    if (dryRun) {
        for (const { file, text } of todo) console.log(`${file.slice(AUDIO_DIR.length + 1)}\t${text}`);
        console.log(`\n${todo.length} of ${clips.length} clips would be generated with voice ${VOICE}.`);
        return;
    }

    if (!API_KEY) {
        console.error(
            `${todo.length} audio clips are missing from public/audio, and GOOGLE_TTS_API_KEY is not set.\n` +
            'Add it to creds.json ({ "GOOGLE_TTS_API_KEY": "..." }) and run `npm run generate-audio`.'
        );
        process.exit(1);
    }

    if (spawnSync('ffmpeg', ['-version']).error) {
        console.error('ffmpeg is required to generate audio clips but was not found on the PATH (brew install ffmpeg).');
        process.exit(1);
    }

    console.log(`Generating ${todo.length} clips with voice ${VOICE}...`);
    let done = 0;
    const queue = [...todo];
    await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
        while (queue.length) {
            await generate(queue.shift());
            if (++done % 100 === 0 || done === todo.length) console.log(`  ${done}/${todo.length}`);
        }
    }));
    console.log('Done.');
}

main().catch(err => {
    console.error(err.message);
    process.exit(1);
});
