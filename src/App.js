import { useEffect, useRef, useState } from "react";

import './App.css';
import Header from "./components/Header";
import Timer from './components/Timer';
import Scoreboard from './components/Scoreboard'
import GuessInput from './components/GuessInput';
import WordDisplay from "./components/WordDisplay";
import voiceBox from "./utils/voicebox";
import { toWords } from "./utils/spanishNumber";
import { randomNumber } from "./utils/randomNumber";
import StartButton from './components/StartButton';
import Summary from "./components/Summary";


function App() {
  const [currentWord, setCurrentWord] = useState();
  const [currentNumber, setCurrentNumber] = useState();
  const [correctAnswer, setCorrectAnswer] = useState();
  const [score, setScore] = useState();
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);

  // The next number is always picked one step ahead, so its audio can load
  // while the player is still answering the current one.
  const nextNumber = useRef();

  const queueNextNumber = () => {
    nextNumber.current = randomNumber();
    voiceBox.preload(nextNumber.current);
  }

  // Preload the sound effects and first number while the start screen is showing.
  useEffect(() => {
    voiceBox.preloadSounds();
    queueNextNumber();
  }, []);

  const nextRound = () => {
    const number = nextNumber.current;
    setCurrentNumber(number);
    setCurrentWord(toWords(number));
    voiceBox.speak(number);
    queueNextNumber();
  }

  const startGame = () => {
    setPlaying(true);
    setFinished(false);
    setScore(0);
    nextRound();
  }

  const endGame = () => {
    setPlaying(false);
    setFinished(true);
    setCurrentNumber();
    setCurrentWord();
  }

  const makeGuess = (guess) => {
    // guess comes from the input as a string
    if (Number(guess) === currentNumber) {
      setScore(score + 1);
      voiceBox.playSound("correct");
    } else {
      voiceBox.playSound("error");
      setCorrectAnswer(currentNumber);
    }
    nextRound();
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
