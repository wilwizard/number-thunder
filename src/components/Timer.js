import { useState, useEffect } from "react";

function Timer({ onTimeout = () => {}, onStart = () => {}, trigger}) {

    let [time, setTime] = useState(30);
    let [running, setRunning] = useState(false);

	const onStartFunction = onStart;

	const startTimer = () => {
		if (running) return;

		setRunning(true);
		setTime(30);
		onStartFunction();
		const invervalId = setInterval(() => {
			if (time === 0) {
				setRunning(false);
				clearInterval(invervalId);
				onTimeout();
			}
			setTime(time); // should be time--
		}, 1000);
	}

	useEffect(() => {
		startTimer();
	}, [trigger]);

	return (
		<div>
			<div>{time}</div>
			{!running && <button onClick={startTimer}>Start</button>}
		</div>
	);
}

export default Timer;
