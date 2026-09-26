import { useState, useEffect } from "react";

import NumberPad from '../components/NumberPad';

import '../styles/GuessInput.css';

export default function GuessInput({onGuess, correctAnswer}) {

    let [inputValue, setInputValue] = useState('');
    let [displayCorrectAnswer, setDisplayCorrectAnswer] = useState(false);
    // The keyboard key currently held down, so the matching keypad button can light up.
    let [pressedKey, setPressedKey] = useState(null);

    const triggerBackspace = () => {
        setInputValue(inputValue.slice(0, inputValue.length - 1));
    }

    const triggerDigit = (digit) => {
        setInputValue(inputValue + digit);
    }

     const submitGuess = () => {
        setInputValue('');
        onGuess(inputValue)
    }
    
    // No dependency array: re-add the listener after every render so it sees the current inputValue.
    useEffect(() => {
        const checkKeyPress = (event) => {
            setPressedKey(event.key);

            if(event.key.match(/[0-9.]/)) {
                triggerDigit(event.key);
            }

            if(event.key === "Backspace") {
                triggerBackspace();
            }

            if(event.key === "Enter") {
                // Stop Enter from also "clicking" whichever keypad button has focus.
                event.preventDefault();
                submitGuess();
            }
        }

        const releaseKey = () => {
            setPressedKey(null);
        }

        document.addEventListener("keydown", checkKeyPress);
        document.addEventListener("keyup", releaseKey);
        return () => {
            document.removeEventListener("keydown", checkKeyPress);
            document.removeEventListener("keyup", releaseKey);
        }
    });

    useEffect(() => {
        setDisplayCorrectAnswer(true);
        setTimeout(() => {
            setDisplayCorrectAnswer(false);
        }, 1000);
    }, [correctAnswer]);

   
   
    return (
        <div className="center">
            <div className="correct-answer">{displayCorrectAnswer && correctAnswer}</div>
            <div className="input-display">{inputValue}</div>
            <NumberPad pressedKey={pressedKey} onBackspacePress={triggerBackspace} onDigitPress={triggerDigit} submitGuess={submitGuess}/>
        </div>
    );
}