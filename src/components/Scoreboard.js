import '../styles/Scoreboard.css';

export default function Scoreboard({ score }) {
    return (
        <div className="scoreboard">
            <div className="score-label">Score</div>
            <div className="score">{score}</div>
        </div>
    )
}