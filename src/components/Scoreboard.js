import '../styles/Scoreboard.css';

export default function Scoreboard({ score }) {
    return (
        <div className="scoreboard">
            <div>Score</div>
            <div>{score}</div>
        </div>
    )
}