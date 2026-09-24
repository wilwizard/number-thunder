import { clipPaths } from './spanishNumber';

// Pause between clips, in seconds. Clips are pre-trimmed of silence by
// scripts/generate-audio.mjs, so this is the whole gap between them.
const GAP = 0.05;
// Decoded clips kept in memory (~100 KB each); the least recently used are dropped past this.
const MAX_CACHED_CLIPS = 200;

// Sound effects, kept loaded for the whole session (outside the clip cache).
const SOUNDS = {
    correct: 'correct.mp3',
    error: 'error.wav',
};

class VoiceBox {
    constructor() {
        this.context = null;
        this.clips = new Map(); // path -> Promise<AudioBuffer>, in least-recently-used order
        this.sounds = {};       // name -> Promise<AudioBuffer>
        this.sources = [];      // number clips currently playing or scheduled
        this.requestId = 0;
    }

    // Created on first use. It can decode (preload) while suspended, but iOS only
    // lets it start playing from a user gesture, so speak() resumes it: the first
    // speak() must happen in a tap/click handler (the Start button does this).
    getContext() {
        if (!this.context) {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.context;
    }

    // The context only plays after being resumed from a user gesture (see getContext).
    resume() {
        const context = this.getContext();
        if (context.state === 'suspended') context.resume();
        return context;
    }

    fetchAudio(path) {
        return fetch(`${process.env.PUBLIC_URL}/${path}`)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
                return res.arrayBuffer();
            })
            .then(data => this.getContext().decodeAudioData(data));
    }

    playBuffer(buffer, when) {
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.connect(this.context.destination);
        source.start(when);
        return source;
    }

    loadClip(path) {
        let clip = this.clips.get(path);
        if (clip) {
            // Re-insert to mark it as recently used.
            this.clips.delete(path);
        } else {
            clip = this.fetchAudio(path);
            // Forget failed loads so the next request retries them.
            clip.catch(() => this.clips.delete(path));
        }
        this.clips.set(path, clip);
        if (this.clips.size > MAX_CACHED_CLIPS) {
            this.clips.delete(this.clips.keys().next().value);
        }
        return clip;
    }

    // Fetches and decodes a number's clips so a later speak() plays instantly.
    preload(number) {
        return Promise.all(clipPaths(number).map(path => this.loadClip(path)))
            .catch(err => console.warn(`Could not preload ${number}:`, err));
    }

    loadSound(name) {
        if (!this.sounds[name]) {
            this.sounds[name] = this.fetchAudio(SOUNDS[name]);
            // Forget failed loads so the next request retries them.
            this.sounds[name].catch(() => delete this.sounds[name]);
        }
        return this.sounds[name];
    }

    preloadSounds() {
        return Promise.all(Object.keys(SOUNDS).map(name => this.loadSound(name)))
            .catch(err => console.warn('Could not preload sounds:', err));
    }

    // Plays a sound effect by name (see SOUNDS). Doesn't interrupt speech.
    async playSound(name) {
        const context = this.resume();
        try {
            this.playBuffer(await this.loadSound(name), context.currentTime);
        } catch (err) {
            console.error(`Could not play sound ${name}:`, err);
        }
    }

    async speak(number) {
        const context = this.resume();
        const requestId = ++this.requestId;
        this.stop();

        try {
            const buffers = await Promise.all(clipPaths(number).map(path => this.loadClip(path)));
            // A newer speak() started while these were loading; let that one play instead.
            if (requestId !== this.requestId) return;

            let startAt = context.currentTime;
            this.sources = buffers.map(buffer => {
                const source = this.playBuffer(buffer, startAt);
                startAt += buffer.duration + GAP;
                return source;
            });
        } catch (err) {
            console.error(`Could not speak ${number}:`, err);
        }
    }

    stop() {
        this.sources.forEach(source => source.stop());
        this.sources = [];
    }
}

const voiceBox = new VoiceBox();

export default voiceBox;
