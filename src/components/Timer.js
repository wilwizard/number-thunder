import { useState, useEffect } from "react";

function Timer({ onTimeout = () => {}, trigger}) {

    const [time, setTime] = useState();
    const [running, setRunning] = useState(false);

	const parseMin = (time) => {
		const min = Math.floor(time / 60);
		return min.toString();
	}

	const parseSec = (time) => {
		let sec = time % 60;
		if(sec.toString().length === 1) {
			return `0${sec}`;
		} else {
			return sec.toString();
		}
	}

	const startTimer = () => {
		setTime(120);
		setRunning(true);
	}

	const endTimer = () => {
		setTime();
		setRunning(false);
	}

	useEffect(() => {
		startTimer();
	}, [trigger]);

	useEffect(() => {
		if (time === 0) {
			endTimer();
			onTimeout();
			return;
		}

		const id = setTimeout(() => {
			// setTime(time - 1);
		}, 1000);
		return () => clearTimeout(id);
	}, [time]);

	return (
		<div>
			{running && <div>{`${parseMin(time)}:${parseSec(time)}`}</div>}
		</div>
	);
}

export default Timer;
