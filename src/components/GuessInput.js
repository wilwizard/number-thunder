import { useState, useEffect } from "react";

export default function GuessInput({onGuess}) {

    let [inputValue, setInputValue] = useState('');

    const checkKeyPress = event => {
        if(event.key.match(/[0-9]/)) {
            setInputValue(inputValue + event.key);
        }

        if(event.key === "Enter") {
            submitGuess();
        }
    }

    useEffect(() => {
        document.addEventListener("keypress", checkKeyPress);
        return () => {
            document.removeEventListener("keypress", checkKeyPress);
        }    
    }, [inputValue]);

    const submitGuess = () => {
        setInputValue('');
        onGuess(inputValue)
    }
   
    return (
        <div>
            <input value={inputValue} readOnly={true}/>
            <button onClick={submitGuess}>Enter</button>
        </div>
    );
}