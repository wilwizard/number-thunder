import '../styles/NumberPad.css';
import NumberButton from "./NumberButton";

export default function NumberPad({onButtonPress, submitGuess}) {
    
    const digits = [1,2,3,4,5,6,7,8,9,0];
    
    return (
        <div className="digits">
            {digits.map(digit => {
                return <NumberButton key={`digit-${digit}`} onPress={onButtonPress} number={digit}/>;
            })}
            <button className="number enter-button" onClick={submitGuess}>Enter</button>
            <div className="number backspace-button">{"<-"}</div>
        </div>
    );
};