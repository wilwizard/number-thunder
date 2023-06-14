import { useState } from "react";
import writtenNumber from "written-number";
import speak from '../utils/speak';


function NumberConverter() {

    let [number, setNumber] = useState();
    let [word, setWord] = useState();
    

   const convert = (e) => {
        let word = writtenNumber(number);
       setWord(word);

       speak(word);
    
   }

   const onUpdateInput = e => {
        setNumber(e.target.value);
   };
	
	return (
		<div>
            Number
			<input onChange={onUpdateInput}/>
			<button onClick={convert}>Convert</button>
            <div> {number} </div>
            <div> {word} </div>
		</div>
	);
}

export default NumberConverter;
