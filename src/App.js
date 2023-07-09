import { useState } from "react";

import './App.css';
import Header from "./components/Header";
import Timer from './components/Timer';
import Scoreboard from './components/Scoreboard'
import GuessInput from './components/GuessInput';
import WordDisplay from "./components/WordDisplay";
import voiceBox from "./utils/speak";
import StartButton from './components/StartButton';
import Summary from "./components/Summary";

import writtenNumber from "written-number";

writtenNumber.defaults.lang = 'es';

const MAX_MAG = 4;
const MAX_SIG_FIGS = 3;


function App() {
  const [currentWord, setCurrentWord] = useState();
  const [currentNumber, setCurrentNumber] = useState();
  const [correctAnswer, setCorrectAnswer] = useState();
  const [score, setScore] = useState();
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);

  
  const generateNumber =  () => {
    const magnitude = Math.ceil(MAX_MAG * Math.random());
    const sigFigs = Math.ceil(MAX_SIG_FIGS * Math.random());
    let number = Math.ceil(10**magnitude * Math.random());

    if (magnitude > sigFigs) {
      const modulus = 10 ** (magnitude - sigFigs);
      number = number - (number % modulus);
    }

    setCurrentNumber(number);
    setCurrentWord(writtenNumber(number))
    voiceBox.speak(writtenNumber(number));
}

  const startGame = () => {
    setPlaying(true);
    setFinished(false);
    setScore(0);
    generateNumber();
  }

  const endGame = () => {
    setPlaying(false);
    setFinished(true);
    setCurrentNumber();
    setCurrentWord();
  }

  const makeGuess = (guess) => {
    if (guess == currentNumber) {
      setScore(score + 1);
      new Audio("/correct.mp3").play();
    } else {
      new Audio("/error.wav").play();
      setCorrectAnswer(currentNumber);
    }
    generateNumber();

  }

  return (
    <div className="App">
      <Header title="Number Thunder"/>
      
      { playing &&
        <div>
        <div className="row">
          <Scoreboard score={score}/>
          <Timer trigger={playing} onTimeout={endGame}/>
        </div>
        <div className="row">
          <WordDisplay word={currentWord}/>
        </div>
        <div className="row">
          <GuessInput correctAnswer={correctAnswer} onGuess={makeGuess}/>
        </div>
      </div>
    }
    {finished && <Summary score={score}/>}
    {!playing && <StartButton onClick={startGame}/>}
    </div>
  );
}

export default App;
