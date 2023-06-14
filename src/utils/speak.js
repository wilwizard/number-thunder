const PITCH = 1;
const RATE = 1;


export default function speak(word) {
    let voices = [];

    if ('speechSynthesis' in window) {

        voices = speechSynthesis.getVoices();
    
        voices = voices.filter(voice => {
            console.log('test');
            return voice.lang === 'es-MX';
        });

        let msg = new SpeechSynthesisUtterance(word);
        const voice = voices[0];

        console.log(voice);


        msg.voice = voice;
        msg.pitch = PITCH;
        msg.rate = RATE;

        window.speechSynthesis.speak(msg);;
    
    
           
    }
}