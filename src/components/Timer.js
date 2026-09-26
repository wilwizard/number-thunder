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

	

	useEffect(() => {
		startTimer();
	}, [trigger]);

	useEffect(() => {
		const endTimer = () => {
			setTime();
			setRunning(false);
		}

		if (time === 0) {
			endTimer();
			onTimeout();
			return;
		}

		const id = setTimeout(() => {
			setTime(time - 1);
		}, 1000);
		return () => clearTimeout(id);
	// onTimeout is left out: it's a new function on every parent render, which would
	// restart the one-second tick each time. The render where time hits 0 has the current one.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [time]);

	return (
		<div>
			{running && <div>{`${parseMin(time)}:${parseSec(time)}`}</div>}
		</div>
	);
}

export default Timer;
