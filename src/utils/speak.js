const PITCH = 1;
const RATE = 1;

class VoiceBox {    
    constructor() {
        this.voices = [];
        speechSynthesis.addEventListener('voiceschanged', this.populateVoices.bind(this));
    }

    populateVoices() {
        console.log('Populate');
        this.voices = speechSynthesis.getVoices();
    }
    
    speak(word) {
        let voices = this.voices.filter(voice => {
            return voice.lang === 'es-MX';
        });

        let msg = new SpeechSynthesisUtterance(word);
        msg.voice = voices[0];
        msg.pitch = PITCH;
        msg.rate = RATE;

        window.speechSynthesis.speak(msg); 
    }
}

const voiceBox = new VoiceBox();

export default voiceBox;