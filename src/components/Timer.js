import { useState } from "react";

function Timer({ onTimeout = () => {}, onStart}) {

    let [time, setTime] = useState(30);
    let [running, setRunning] = useState(false);

	const startTimer = () => {
		setRunning(true);
		setTime(30);
		onStart();
		const invervalId = setInterval(() => {
			if (time === 0) {
				setRunning(false);
				clearInterval(invervalId);
				onTimeout();
			}
			setTime(time--);
		}, 1000);
	}

	return (
		<div>
			<div>{time}</div>
			{!running && <button onClick={startTimer}>Start</button>}
		</div>
	);
}

export default Timer;
