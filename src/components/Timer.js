import { useState } from "react";

function Timer({ onTimeout = () => {} }) {


    let [time, setTime] = useState(30);
    let [running, setRunning] = useState(false);

	const startTimer = () => {
		setRunning(true);
		const invervalId = setInterval(() => {
			if (time === 0) {
				setRunning(false);
				clearInterval(invervalId);
				onTimeout();
			}
			setTime(time--);
		}, 100);
	}

	return (
		<div>
			<div>{time}</div>
			<div>{running ? 'running' : 'stopped'}</div>
			<button onClick={startTimer}>Start</button>
		</div>
	);
}

export default Timer;
