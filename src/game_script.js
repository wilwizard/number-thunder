const writtenNumber = require('written-number');
const readline = require("readline");
const say = require('say');
const SPEAKER = "Juan"; //Juan/Paulina
const SPEED = 1.0;
const MAX_SIG_FIGS = 6;
const MAX_MAG = 7;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Countdown {
    constructor(seconds) {
        this.startTime = Date.now();
        this.endTime = this.startTime + 1000*seconds;
    }

    stillRunning() {
        return this.endTime > Date.now();
    }
}

writtenNumber.defaults.lang = 'es';

async function play() {
    const magnitude = Math.ceil(MAX_MAG * Math.random());
    const sigFigs = Math.ceil(MAX_SIG_FIGS * Math.random());
    let number = Math.ceil(10**magnitude * Math.random());

    if (magnitude > sigFigs) {
        const modulus = 10 ** (magnitude - sigFigs);
        number = number - (number % modulus);
    }

    const word = writtenNumber(number);

    return new Promise((resolve, reject) => {
        say.speak(word, SPEAKER, SPEED);
        rl.question(`${word}: `, function(answer) {
            if (answer == number) {
                say.speak("Correcto", SPEAKER, SPEED, function() {
                    resolve();
                });
                console.log("Correcto\n");
            } else {
                say.speak("Incorrecto", SPEAKER, SPEED, function() {
                    resolve();
                });
                console.log(`La respuesta correcta es ${number}\n`);
            }
        });
    });
};

async function run() {
    const clock = new Countdown(30);
    while(clock.stillRunning()) {
        await play();
    }
    process.exit(0);
}

run();