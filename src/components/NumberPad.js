import '../styles/NumberPad.css';
import NumberButton from "./NumberButton";

export default function NumberPad({onButtonPress}) {
    
    const digits = [1,2,3,4,5,6,7,8,9,0];
    
    return (
        <div className="digits">
            {digits.map(digit => {
                return <NumberButton onPress={onButtonPress} number={digit}/>;
            })}
        </div>
    );
};