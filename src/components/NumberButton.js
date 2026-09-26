import '../styles/NumberButton.css';

export default function NumberButton({number, onPress, pressed}) {
    return (
        <button onClick={() => onPress(number)} className={`number secondary outline ${pressed ? "pressed" : ""}`}>{number}</button>
    );
}
