import '../styles/Summary.css';

export default function Summary({score}) {
    return (
        <div className="message">
            Your score was {score}
        </div>
    )
}