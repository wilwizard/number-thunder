import '../styles/NumberPad.css';
import NumberButton from "./NumberButton";

export default function NumberPad({onDigitPress, onBackspacePress, submitGuess, pressedKey}) {

    // Keys are in reading order for the 4-column grid, like a desktop number pad:
    //   7 8 9 ⌫
    //   4 5 6 Enter (3 rows tall)
    //   1 2 3
    //   0 (2 columns wide) .
    // pressedKey is a keyboard key name like "7", "Enter" or "Backspace".
    return (
        <div className="digits">
            {[7, 8, 9].map(digit => <NumberButton key={digit} onPress={onDigitPress} number={digit} pressed={pressedKey === String(digit)}/>)}
            <button className={`number secondary outline ${pressedKey === "Backspace" ? "pressed" : ""}`} onClick={onBackspacePress} aria-label="Backspace">⌫</button>

            {[4, 5, 6].map(digit => <NumberButton key={digit} onPress={onDigitPress} number={digit} pressed={pressedKey === String(digit)}/>)}
            <button className={`number enter ${pressedKey === "Enter" ? "pressed" : ""}`} onClick={submitGuess}>Enter</button>

            {[1, 2, 3].map(digit => <NumberButton key={digit} onPress={onDigitPress} number={digit} pressed={pressedKey === String(digit)}/>)}

            <button className={`number secondary outline zero ${pressedKey === "0" ? "pressed" : ""}`} onClick={() => onDigitPress(0)}>0</button>
            <button className={`number secondary outline ${pressedKey === "." ? "pressed" : ""}`} onClick={() => onDigitPress(".")}>.</button>
        </div>
    );
};
