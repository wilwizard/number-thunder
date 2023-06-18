import '../styles/NumberButton.css';

export default function NumberButton({number, onPress}) {
    
    let className = "number"
    if (number === 0) {
        className += ' end';
    }
    return (
        <div onClick={() => onPress(number)} className={className}>{number}</div>
    );
}