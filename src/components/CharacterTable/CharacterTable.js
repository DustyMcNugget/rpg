import React from 'react';
import '../.././App.css';
import './CharacterTable.css'

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
  return (
  	<div className="card">
  		<h3>{name}</h3>
  		<table>
  			<tbody>{tableCells}</tbody>
  		</table>
  	</div>
	)
}
export default PlayerCard;