import React from 'react';

const characterTable = (character) => {
	if (!character.name) {
		return 'No Character'
	}
	const char = character;
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
  return <table key='table'><tbody>{tableCells}</tbody></table>
}
export default characterTable;