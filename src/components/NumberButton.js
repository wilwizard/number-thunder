import '../styles/NumberButton.css';

export default function NumberButton({number, onPress}) {
    
    return (
        <div onClick={() => onPress(number)}className='number'>{number}</div>
    );
}