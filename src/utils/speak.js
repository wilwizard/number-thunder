/*global responsiveVoice*/
class VoiceBox {    
    speak(word) {
        responsiveVoice.speak(word, "Spanish Latin American Female");
    }
}

const voiceBox = new VoiceBox();

export default voiceBox;