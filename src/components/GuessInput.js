import { useState, useEffect } from "react";

import NumberPad from '../components/NumberPad';

import '../styles/GuessInput.css';

export default function GuessInput({onGuess}) {

    let [inputValue, setInputValue] = useState('');

    const checkKeyPress = event => {
        if(event.key.match(/[0-9]/)) {
            setInputValue(inputValue + event.key);
        }

        if(event.key === "Backspace") {
            setInputValue(inputValue.slice(0, inputValue.length - 1));
        }

        if(event.key === "Enter") {
            submitGuess();
        }
    }

    const triggerDigit = (digit) => {
        setInputValue(inputValue + digit);
    }

    useEffect(() => {
        document.addEventListener("keydown", checkKeyPress);
        return () => {
            document.removeEventListener("keydown", checkKeyPress);
        }    
    }, [inputValue]);

    const submitGuess = () => {
        setInputValue('');
        onGuess(inputValue)
    }
   
    return (
        <div className="center">
            <input className="center input-display" value={inputValue} readOnly={true}/>
            <NumberPad onButtonPress={triggerDigit} submitGuess={submitGuess}/>
        </div>
    );
}