import '../styles/StartButton.css';

export default function StartButton({onClick}) {
    return <div className="button button-primary" onClick={onClick}>Start</div>;
}