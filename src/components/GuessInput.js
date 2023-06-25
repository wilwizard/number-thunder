import { useState, useEffect } from "react";

import NumberPad from '../components/NumberPad';

import '../styles/GuessInput.css';

export default function GuessInput({onGuess, correctAnswer}) {

    let [inputValue, setInputValue] = useState('');
    let [displayCorrectAnswer, setDisplayCorrectAnswer] = useState(false);

    const checkKeyPress = event => {
        if(event.key.match(/[0-9]/)) {
            triggerDigit(event.key);
        }

        if(event.key === "Backspace") {
            triggerBackspace();
        }

        if(event.key === "Enter") {
            submitGuess();
        }
    }

    const triggerDigit = (digit) => {
        setInputValue(inputValue + digit);
    }

    const triggerBackspace = () => {
        setInputValue(inputValue.slice(0, inputValue.length - 1));
    }

    useEffect(() => {
        document.addEventListener("keydown", checkKeyPress);
        return () => {
            document.removeEventListener("keydown", checkKeyPress);
        }    
    }, [inputValue]);

    useEffect(() => {
        setDisplayCorrectAnswer(true);
        setTimeout(() => {
            setDisplayCorrectAnswer(false);
        }, 1000);
    }, [correctAnswer]);

    const submitGuess = () => {
        setInputValue('');
        onGuess(inputValue)
    }
   
    return (
        <div className="center">
            <div className="correct-answer">{displayCorrectAnswer && correctAnswer}</div>
            <div className="input-display">{inputValue}</div>
            <NumberPad onBackspacePress={triggerBackspace} onDigitPress={triggerDigit} submitGuess={submitGuess}/>
        </div>
    );
}