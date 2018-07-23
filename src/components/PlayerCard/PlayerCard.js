import React from 'react';
import Card from '.././Card/Card.js'
import '../.././App.css';
import './PlayerCard.css'

const PlayerCard = (props) => {
	const text = (props.altText ? props.altText : "No player")
	if (!props.selectedChar.name) {
		return (
			<div className="card">
				<h3>{text}</h3>
			</div>
		)
	}
	const char = props.selectedChar;
	const {alignment, name, xp, level, hitPoints, charClass} = char;
	const rows = [["Class", charClass], ["Alignment", alignment], ["Level", level], ["Experience", xp], ["Hit Points", hitPoints]];
  const tableCells = rows.map((element) => {
    return(
    	<tr key={element[0]}>
    		<td>{element[0]}</td>
    		<td>{element[1]}</td>
    	</tr>
    );
  })
  const table = <table><tbody>{tableCells}</tbody></table>
  return (
  	<Card header={name} content={table} />
	)
}
export default PlayerCard;